import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class TwoFactorService {
  private readonly APP_NAME = 'Teomed';

  generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `${this.APP_NAME} (${email})`,
      length: 32,
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    };
  }

  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      throw new Error('Erro ao gerar QR Code');
    }
  }

  verifyToken(secret: string, token: string): boolean {
    console.log('🔐 TwoFactorService - Verificando TOTP:');
    console.log('  Secret (primeiros 10 chars):', secret.substring(0, 10) + '...');
    console.log('  Token recebido:', token);
    console.log('  Token length:', token.length);
    console.log('  Timestamp atual:', Date.now());
    console.log('  Data/Hora:', new Date().toISOString());
    
    // Gerar token atual para comparação
    const currentToken = speakeasy.totp({
      secret,
      encoding: 'base32',
    });
    console.log('  Token esperado agora:', currentToken);
    
    const result = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Permite 2 intervalos de 30s antes e depois
    });
    
    console.log('  Resultado da verificação:', result);
    
    if (!result) {
      // Tentar com windows maiores (ex.: clock skew em produção)
      const resultWindow5 = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 5,
      });
      console.log('  Resultado com window=5:', resultWindow5);
      return resultWindow5;
    }
    
    return true;
  }

  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  hashBackupCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  verifyBackupCode(code: string, hashedCodes: string[]): boolean {
    const hashedInput = this.hashBackupCode(code);
    return hashedCodes.includes(hashedInput);
  }
}
