import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { TwoFactorService } from './two-factor.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
    private twoFactorService: TwoFactorService,
  ) {}

  private normalizeCreatedAt(createdAt: unknown): Date | null {
    if (!createdAt) return null;

    if (createdAt instanceof Date) {
      return Number.isNaN(createdAt.getTime()) ? null : createdAt;
    }

    const tryParse = (value: unknown) => {
      if (typeof value !== 'string') return null;
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date;

      const match = value.match(/['\"]?\$date['\"]?\s*[:=]\s*['\"]([^'\"]+)['\"]/i);
      if (!match) return null;

      const extracted = new Date(match[1]);
      return Number.isNaN(extracted.getTime()) ? null : extracted;
    };

    if (typeof createdAt === 'string') {
      return tryParse(createdAt);
    }

    if (typeof createdAt === 'object') {
      const anyObj = createdAt as { $date?: unknown; ['$date']?: unknown };
      const raw = anyObj.$date ?? anyObj['$date'];
      if (raw instanceof Date) {
        return Number.isNaN(raw.getTime()) ? null : raw;
      }
      return tryParse(raw);
    }

    return null;
  }

  async validateUser(email: string, password: string): Promise<AuthDocument | null> {
    const user = await this.authModel.findOne({ email }).exec();

    console.log(user);
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Se MFA estiver habilitado, retornar token temporário
    if (user.twoFactorEnabled) {
      const tempPayload = { 
        sub: user._id.toString(), 
        email: user.email,
        temp: true 
      };
      return {
        requires2FA: true,
        tempToken: this.jwtService.sign(tempPayload, { expiresIn: '10m' }),
      };
    }

    // MFA OBRIGATÓRIO: Se não estiver ativo, forçar setup
    if (!user.twoFactorEnabled) {
      const setupPayload = { 
        sub: user._id.toString(), 
        email: user.email,
        requiresSetup: true 
      };
      return {
        requiresMfaSetup: true,
        setupToken: this.jwtService.sign(setupPayload, { expiresIn: '30m' }),
      };
    }

    // Login normal (não deve chegar aqui com MFA obrigatório)
    const payload = { sub: user._id.toString(), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async setupTwoFactor(userId: string) {
    const user = await this.authModel.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const secret = user.twoFactorSecret ? user.twoFactorSecret : this.twoFactorService.generateSecret(user.email).secret;

    const otpauthUrl = user.twoFactorSecret
      ? this.twoFactorService.getOtpAuthUrl(user.email, user.twoFactorSecret)
      : this.twoFactorService.getOtpAuthUrl(user.email, secret);

    const qrCode = await this.twoFactorService.generateQRCode(otpauthUrl);

    if (!user.twoFactorSecret) {
      const normalizedCreatedAt = this.normalizeCreatedAt((user as any).createdAt);
      await this.authModel
        .updateOne(
          { _id: userId },
          {
            $set: {
              twoFactorSecret: secret,
              ...(normalizedCreatedAt ? { createdAt: normalizedCreatedAt } : {}),
            },
          }
        )
        .exec();
    }

    return {
      qrCode,
      secret,
    };
  }

  async confirmTwoFactor(userId: string, token: string) {
    const user = await this.authModel.findById(userId).lean();
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Configuração MFA não iniciada');
    }

    console.log('🔐 Verificando MFA:');
    console.log('  Secret:', user.twoFactorSecret);
    console.log('  Token recebido:', token);
    console.log('  Token length:', token.length);
    
    const isValid = this.twoFactorService.verifyToken(user.twoFactorSecret, token);
    console.log('  Resultado:', isValid);
    
    if (!isValid) {
      throw new BadRequestException('Código inválido');
    }

    // Gerar backup codes
    const backupCodes = this.twoFactorService.generateBackupCodes();
    const hashedBackupCodes = backupCodes.map((code) => this.twoFactorService.hashBackupCode(code));

    const normalizedCreatedAt = this.normalizeCreatedAt((user as any).createdAt);
    await this.authModel
      .updateOne(
        { _id: userId },
        {
          $set: {
            twoFactorEnabled: true,
            backupCodes: hashedBackupCodes,
            ...(normalizedCreatedAt ? { createdAt: normalizedCreatedAt } : {}),
          },
        }
      )
      .exec();

    // Emitir token definitivo após ativação (remove requiresSetup do fluxo obrigatório)
    const payload = { sub: (user as any)._id.toString(), email: user.email };

    return {
      success: true,
      backupCodes, // Retornar códigos não hashados para o usuário salvar
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyTwoFactor(tempToken: string, token: string, isBackupCode: boolean = false) {
    console.log('🔐 verifyTwoFactor chamado');
    console.log('  tempToken (primeiros 20 chars):', tempToken?.substring(0, 20) + '...');
    console.log('  token:', token);
    console.log('  isBackupCode:', isBackupCode);
    
    let decoded;
    try {
      decoded = this.jwtService.verify(tempToken, { clockTolerance: 60 });
      console.log('✅ Token decodificado:', {
        sub: decoded.sub,
        email: decoded.email,
        temp: decoded.temp,
        exp: decoded.exp,
        iat: decoded.iat
      });
    } catch (error) {
      console.log('❌ Erro ao verificar token:', error.message);
      throw new UnauthorizedException('Token temporário inválido ou expirado');
    }

    if (!decoded.temp) {
      console.log('❌ Token não é temporário');
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.authModel.findById(decoded.sub).lean();
    if (!user) {
      console.log('❌ Usuário não encontrado:', decoded.sub);
      throw new UnauthorizedException('Usuário não encontrado');
    }
    
    if (!user.twoFactorEnabled) {
      console.log('❌ MFA não está habilitado para usuário:', user.email);
      throw new UnauthorizedException('MFA não configurado');
    }
    
    console.log('✅ Usuário encontrado:', user.email);

    let isValid = false;

    if (isBackupCode) {
      // Verificar backup code
      isValid = this.twoFactorService.verifyBackupCode(token, user.backupCodes);
      if (isValid) {
        // Remover backup code usado
        const hashedCode = this.twoFactorService.hashBackupCode(token);
        const normalizedCreatedAt = this.normalizeCreatedAt((user as any).createdAt);
        await this.authModel
          .updateOne(
            { _id: (user as any)._id },
            {
              $pull: { backupCodes: hashedCode },
              ...(normalizedCreatedAt ? { $set: { createdAt: normalizedCreatedAt } } : {}),
            }
          )
          .exec();
      }
    } else {
      // Verificar TOTP
      isValid = this.twoFactorService.verifyToken(user.twoFactorSecret, token);
    }

    if (!isValid) {
      throw new BadRequestException('Código inválido');
    }

    // Gerar JWT definitivo
    const payload = { sub: (user as any)._id.toString(), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async disableTwoFactor(userId: string, password: string) {
    const user = await this.authModel.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verificar senha antes de desativar
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const normalizedCreatedAt = this.normalizeCreatedAt((user as any).createdAt);
    await this.authModel
      .updateOne(
        { _id: userId },
        {
          $set: {
            twoFactorEnabled: false,
            backupCodes: [],
            ...(normalizedCreatedAt ? { createdAt: normalizedCreatedAt } : {}),
          },
          $unset: {
            twoFactorSecret: 1,
          },
        }
      )
      .exec();

    return { success: true };
  }

  async getTwoFactorStatus(userId: string) {
    console.log('📊 getTwoFactorStatus chamado para userId:', userId);
    
    const user = await this.authModel.findById(userId).lean();
    if (!user) {
      console.log('❌ Usuário não encontrado:', userId);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    console.log('✅ Status MFA:', {
      enabled: user.twoFactorEnabled,
      backupCodesCount: user.backupCodes?.length || 0
    });

    return {
      enabled: user.twoFactorEnabled || false,
      backupCodesCount: user.backupCodes?.length || 0,
    };
  }

  async debugTwoFactor(userId: string) {
    const user = await this.authModel.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const speakeasy = require('speakeasy');
    const currentToken = user.twoFactorSecret ? speakeasy.totp({
      secret: user.twoFactorSecret,
      encoding: 'base32',
    }) : null;

    return {
      userId: (user as any)._id,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled,
      hasSecret: !!user.twoFactorSecret,
      secretLength: user.twoFactorSecret?.length || 0,
      secretPreview: user.twoFactorSecret?.substring(0, 10) + '...',
      currentToken,
      serverTime: new Date().toISOString(),
      timestamp: Date.now(),
    };
  }
}
