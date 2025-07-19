import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthDocument | null> {
    const user = await this.authModel.findOne({ email }).exec();
    
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

    const payload = { sub: user._id.toString(), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
