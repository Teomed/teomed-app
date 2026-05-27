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
        tempToken: this.jwtService.sign(tempPayload, { expiresIn: '5m' }),
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
    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { secret, otpauthUrl } = this.twoFactorService.generateSecret(user.email);
    const qrCode = await this.twoFactorService.generateQRCode(otpauthUrl);

    // Salvar secret temporariamente (ainda não ativado)
    user.twoFactorSecret = secret;
    await user.save();

    return {
      qrCode,
      secret,
    };
  }

  async confirmTwoFactor(userId: string, token: string) {
    const user = await this.authModel.findById(userId);
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
    const hashedBackupCodes = backupCodes.map(code => 
      this.twoFactorService.hashBackupCode(code)
    );

    // Ativar MFA
    user.twoFactorEnabled = true;
    user.backupCodes = hashedBackupCodes;
    await user.save();

    return {
      success: true,
      backupCodes, // Retornar códigos não hashados para o usuário salvar
    };
  }

  async verifyTwoFactor(tempToken: string, token: string, isBackupCode: boolean = false) {
    let decoded;
    try {
      decoded = this.jwtService.verify(tempToken);
    } catch {
      throw new UnauthorizedException('Token temporário inválido ou expirado');
    }

    if (!decoded.temp) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.authModel.findById(decoded.sub);
    if (!user || !user.twoFactorEnabled) {
      throw new UnauthorizedException('MFA não configurado');
    }

    let isValid = false;

    if (isBackupCode) {
      // Verificar backup code
      isValid = this.twoFactorService.verifyBackupCode(token, user.backupCodes);
      if (isValid) {
        // Remover backup code usado
        const hashedCode = this.twoFactorService.hashBackupCode(token);
        user.backupCodes = user.backupCodes.filter(code => code !== hashedCode);
        await user.save();
      }
    } else {
      // Verificar TOTP
      isValid = this.twoFactorService.verifyToken(user.twoFactorSecret, token);
    }

    if (!isValid) {
      throw new UnauthorizedException('Código inválido');
    }

    // Gerar JWT definitivo
    const payload = { sub: user._id.toString(), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async disableTwoFactor(userId: string, password: string) {
    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verificar senha antes de desativar
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.backupCodes = [];
    await user.save();

    return { success: true };
  }

  async getTwoFactorStatus(userId: string) {
    console.log('📊 getTwoFactorStatus chamado para userId:', userId);
    
    const user = await this.authModel.findById(userId);
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
}
