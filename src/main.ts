import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import firebaseAdmin from 'firebase-admin';
import { initializeApp as initializeClientApp } from 'firebase/app';
import { AppModule } from './app.module';

async function initializeFirebase() {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });
  const firebaseConfig = await import(process.env.FIREBASE_CLIENT_CREDENTIALS);
  initializeClientApp(firebaseConfig);
}

async function configureSwagger(app) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS Boilerplate')
    .setDescription('A simple NestJS app template')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  await initializeFirebase();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await configureSwagger(app);
  await app.listen(3000);
}

bootstrap();
