import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '@app/auth/account/account.module';

@Module({
  imports: [AccountModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
