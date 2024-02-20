/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:[`http://${process.env.POSTGRES_HOST}:3000`, "https://api.intra.42.fr/"],
    credentials: true,
  })
  app.useGlobalPipes( new ValidationPipe( { whitelist: true } ) )
  app.use(cookieParser());
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3001);
}
bootstrap();
