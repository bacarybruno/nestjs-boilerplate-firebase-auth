import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [FirebaseModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
