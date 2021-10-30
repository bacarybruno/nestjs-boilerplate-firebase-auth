import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
