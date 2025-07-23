import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para desenvolvimento
  const port = process.env.PORT || 3003;
  await app.listen(port);
}
bootstrap();
