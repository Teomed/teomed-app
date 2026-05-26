import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto {
  email: string;
  password: string;
}

class VerifyTwoFactorDto {
  tempToken: string;
  token: string;
  isBackupCode?: boolean;
}

class ConfirmTwoFactorDto {
  token: string;
}

class DisableTwoFactorDto {
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('setup-2fa')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setupTwoFactor(@Request() req) {
    return this.authService.setupTwoFactor(req.user.userId);
  }

  @Post('confirm-2fa')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async confirmTwoFactor(@Request() req, @Body() body: ConfirmTwoFactorDto) {
    return this.authService.confirmTwoFactor(req.user.userId, body.token);
  }

  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  async verifyTwoFactor(@Body() body: VerifyTwoFactorDto) {
    return this.authService.verifyTwoFactor(
      body.tempToken,
      body.token,
      body.isBackupCode || false,
    );
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async disableTwoFactor(@Request() req, @Body() body: DisableTwoFactorDto) {
    return this.authService.disableTwoFactor(req.user.userId, body.password);
  }

  @Get('2fa-status')
  @UseGuards(JwtAuthGuard)
  async getTwoFactorStatus(@Request() req) {
    return this.authService.getTwoFactorStatus(req.user.userId);
  }
}
