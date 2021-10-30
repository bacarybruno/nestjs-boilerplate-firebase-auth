import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AccessTokenDto,
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
      throw new BadRequestException(error);
    }
  }

  async verifyResetPasswordCode(data: VerifyResetPassworDto): Promise<boolean> {
    try {
      const result = await this.firebaseService.verifyResetPasswordCode(data);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async resetPassword(data: ResetPassworDto): Promise<void> {
    try {
      const result = await this.firebaseService.resetPassword(data);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(credentials: LoginDto): Promise<AccessTokenDto> {
    try {
      const tokens = await this.firebaseService.login(credentials);
      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async socialSignIn(
    provider: SocialSignInProviders,
    token: string,
  ): Promise<AccessTokenDto> {
    try {
      const tokens = await this.firebaseService.socialLogin(provider, token);
      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async phoneNumberSignIn(credentials: PhoneNumberLoginDto) {
    try {
      const tokens = await this.firebaseService.phoneNumberLogin(
        credentials.verificationId,
        credentials.code,
      );
      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createAccount(
    account: CreateAccountDto,
    language: string,
  ): Promise<AccessTokenDto> {
    try {
      const createdUser = await this.firebaseService.createAccount(account);
      await this.firebaseService.sendVerificationEmail(account, language);
      return await this.firebaseService.login({
        email: createdUser.email,
        password: account.password,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async confirmEmail(body: ConfirmEmailDto) {
    try {
      return await this.firebaseService.confirmUserEmail(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AccessTokenDto> {
    try {
      return await this.firebaseService.refreshToken(refreshToken);
    } catch (error) {
      throw new BadRequestException(error.response.data.error);
    }
  }
}
