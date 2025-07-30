import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealthCheck() {
    return {
      status: 'ok',
      message: 'Teomed API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
