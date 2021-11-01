import { FirebaseModule } from '@app/firebase/firebase.module';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [FirebaseModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
