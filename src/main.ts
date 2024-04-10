import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import "reflect-metadata"
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'
import { corsOptions } from './config/corsOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.setGlobalPrefix('api/v1')
  app.enableCors(corsOptions);
  app.use(cookieParser());
  const config = new DocumentBuilder().addBearerAuth()
    .setTitle('Document Transaction Record Draft')
    .setDescription('API for DTR')
    .setVersion('1.0')
    .addTag('DTR')
    .build();
  const PORT = configService.get('PORT')
  console.log(PORT);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();
