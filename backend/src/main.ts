import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/afisha', {
    exclude: ['content/afisha/(.*)'],
  });
  app.enableCors();
  app.useLogger(new TskvLogger());
  await app.listen(3000);
}
bootstrap();
