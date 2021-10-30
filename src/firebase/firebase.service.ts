import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { auth } from 'firebase-admin';
import {
  UserRecord,
  Auth as AuthServer,
  DecodedIdToken,
} from 'firebase-admin/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  Auth as AuthClient,
  GoogleAuthProvider,
  OAuthCredential,
  FacebookAuthProvider,
  checkActionCode,
  ActionCodeOperation,
} from 'firebase/auth';
import { lastValueFrom, map } from 'rxjs';
import {
  AccessToken,
  AccessTokenDto,
  ConfirmEmailDto,
  CreateAccountDto,
  LoginDto,
  ResetPassworDto,
  SocialSignInProviders,
  VerifyResetPassworDto,
} from '../account/account.types';

const GOOGLE_APIS_BASE_URL = 'https://identitytoolkit.googleapis.com/v1';
const STS_APIS_BASE_URL = 'https://securetoken.googleapis.com/v1';

@Injectable()
export class FirebaseService {
  API_KEY: string;
  authClientInstance: AuthClient;
  authServerInstance: AuthServer;

  constructor(configService: ConfigService, private httpService: HttpService) {
    this.API_KEY = configService.get('FIREBASE_API_KEY');
    this.authClientInstance = getAuth();
    this.authServerInstance = auth();
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.authClientInstance, email);
  }

  async verifyResetPasswordCode(data: VerifyResetPassworDto): Promise<boolean> {
    return this.checkActionCode(
      ActionCodeOperation.PASSWORD_RESET,
      data.code,
      data.email,
    );
  }

  async resetPassword(data: ResetPassworDto): Promise<void> {
    return confirmPasswordReset(
      this.authClientInstance,
      data.code,
      data.password,
    );
  }

  async login(credentials: LoginDto): Promise<AccessTokenDto> {
    const result = await signInWithEmailAndPassword(
      this.authClientInstance,
      credentials.email,
      credentials.password,
    );
    return {
      accessToken: await result.user.getIdToken(),
      refreshToken: result.user.refreshToken,
    };
  }

  async phoneNumberLogin(
    verificationId: string,
    code: string,
  ): Promise<AccessTokenDto> {
    try {
      const request$ = this.httpService
        .post(
          `${GOOGLE_APIS_BASE_URL}/accounts:signInWithPhoneNumber?key=${this.API_KEY}`,
          {
            code,
            sessionInfo: verificationId,
          },
        )
        .pipe(map((res) => res.data));
      const { idToken, refreshToken } = await lastValueFrom(request$);
      return { accessToken: idToken, refreshToken };
    } catch (error) {
      throw new Error(
        'Phone auth: Unable to verify the informations based on the provided code and verificationId.',
      );
    }
  }

  async socialLogin(
    provider: SocialSignInProviders,
    token: string,
  ): Promise<AccessTokenDto> {
    let authCredential: OAuthCredential;
    switch (provider) {
      case SocialSignInProviders.GOOGLE:
        authCredential = GoogleAuthProvider.credential(token);
        break;
      case SocialSignInProviders.FACEBOOK:
        authCredential = FacebookAuthProvider.credential(token);
        break;
      default:
        break;
    }
    const result = await signInWithCredential(
      this.authClientInstance,
      authCredential,
    );
    return {
      accessToken: await result.user.getIdToken(),
      refreshToken: result.user.refreshToken,
    };
  }

  async createAccount(account: CreateAccountDto): Promise<UserRecord> {
    return this.authServerInstance.createUser({
      email: account.email,
      password: account.password,
      displayName: `${account.firstName} ${account.lastName}`,
    });
  }

  async sendVerificationEmail(
    credentials: LoginDto,
    language: string,
  ): Promise<void> {
    this.authClientInstance.languageCode = language;
    const result = await signInWithEmailAndPassword(
      this.authClientInstance,
      credentials.email,
      credentials.password,
    );
    return sendEmailVerification(result.user);
  }

  private async checkActionCode(
    operation: typeof ActionCodeOperation[keyof typeof ActionCodeOperation],
    code: string,
    email: string,
  ) {
    const result = await checkActionCode(this.authClientInstance, code);
    if (result.operation === operation && result.data.email === email) {
      return true;
    }
    throw new Error('Code does not match the operation');
  }

  async confirmUserEmail(data: ConfirmEmailDto): Promise<UserRecord> {
    await this.checkActionCode(
      ActionCodeOperation.VERIFY_EMAIL,
      data.code,
      data.email,
    );
    const user = await this.authServerInstance.getUserByEmail(data.email);
    return this.authServerInstance.updateUser(user.uid, {
      emailVerified: true,
    });
  }

  async decodeToken(accessToken: AccessToken): Promise<DecodedIdToken> {
    return this.authServerInstance.verifyIdToken(accessToken, true);
  }

  extractToken(request: Request): string {
    return (
      request.header('Authorization')?.replace('Bearer', '')?.trim() ||
      (request.query.accessToken as string)
    );
  }

  async refreshToken(refreshToken: string): Promise<AccessTokenDto> {
    const request$ = this.httpService
      .post(
        `${STS_APIS_BASE_URL}/token?key=${this.API_KEY}&grant_type=refresh_token&refresh_token=${refreshToken}`,
      )
      .pipe(map((res) => res.data));
    const { id_token, refresh_token } = await lastValueFrom(request$);
    return { accessToken: id_token, refreshToken: refresh_token };
  }
}
