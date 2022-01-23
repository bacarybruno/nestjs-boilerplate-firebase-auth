import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function configureSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS Boilerplate')
    .setDescription('A simple NestJS app template')
    .setVersion('0.0.1')
    .addTag('Account')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function configureBindings(app: NestExpressApplication) {
  app.useGlobalPipes(new ValidationPipe());
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureBindings(app);
  await configureSwagger(app);
  await app.listen(process.env.port || 3001);
}

bootstrap();
