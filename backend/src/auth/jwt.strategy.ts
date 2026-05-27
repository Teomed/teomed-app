import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required for security');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    console.log('🔑 JWT Strategy - Validando payload:', {
      sub: payload.sub,
      email: payload.email,
      temp: payload.temp,
      requiresSetup: payload.requiresSetup,
      exp: payload.exp,
      iat: payload.iat
    });
    
    // Aceitar tokens temporários (temp) e de setup (requiresSetup)
    const user = { 
      userId: payload.sub,
      email: payload.email,
      temp: payload.temp,
      requiresSetup: payload.requiresSetup
    };
    
    console.log('✅ JWT Strategy - Usuário validado:', user);
    return user;
  }
}
