import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AccessToken,
  ConfirmEmailDto,
  CreateAccountDto,
  LoginDto,
  PhoneNumberLoginDto,
  ResetPassworDto,
  SocialSignInProviders,
  VerifyResetPassworDto,
} from './account.types';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AccountService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async sendResetPasswordEmail(email: string): Promise<void> {
    try {
      const result = await this.firebaseService.sendResetPasswordEmail(email);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyResetPasswordCode(data: VerifyResetPassworDto): Promise<boolean> {
    try {
      const result = await this.firebaseService.verifyResetPasswordCode(data);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetPassword(data: ResetPassworDto): Promise<void> {
    try {
      const result = await this.firebaseService.resetPassword(data);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(credentials: LoginDto): Promise<AccessToken> {
    try {
      const accessToken = await this.firebaseService.login(credentials);
      return accessToken;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async socialSignIn(
    provider: SocialSignInProviders,
    token: string,
  ): Promise<AccessToken> {
    try {
      const accessToken = await this.firebaseService.socialLogin(
        provider,
        token,
      );
      return accessToken;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async phoneNumberSignIn(credentials: PhoneNumberLoginDto) {
    try {
      const accessToken = await this.firebaseService.phoneNumberLogin(
        credentials.verificationId,
        credentials.code,
      );
      return accessToken;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createAccount(
    account: CreateAccountDto,
    language: string,
  ): Promise<AccessToken> {
    try {
      const createdUser = await this.firebaseService.createAccount(account);
      const accessToken = await this.firebaseService.login({
        email: createdUser.email,
        password: account.password,
      });
      await this.firebaseService.sendVerificationEmail(account, language);
      return accessToken;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async confirmEmail(body: ConfirmEmailDto) {
    return this.firebaseService.confirmUserEmail(body);
  }
}
