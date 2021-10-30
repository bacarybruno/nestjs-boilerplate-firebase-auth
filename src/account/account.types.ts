import { ApiProperty } from '@nestjs/swagger';
import {
  DecodedIdToken,
  MultiFactorSettings,
  UserInfo,
  UserMetadata,
  UserRecord,
} from 'firebase-admin/auth';
import { IsEmail, IsNotEmpty } from 'class-validator';

export type AccessToken = string;

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() password: string;
}

export class SocialLoginDto {
  @ApiProperty() @IsNotEmpty() token: string;
}

export class PhoneNumberLoginDto {
  @ApiProperty() @IsNotEmpty() verificationId: string;
  @ApiProperty() @IsNotEmpty() code: string;
}

export class CreateAccountDto extends LoginDto {
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
}

export class InitResetPasswordDto {
  @ApiProperty() @IsEmail() email: string;
}

export class VerifyResetPassworDto {
  @ApiProperty() @IsNotEmpty() code: string;
  @ApiProperty() @IsNotEmpty() email: string;
}

export class ResetPassworDto {
  @ApiProperty() code: string;
  @ApiProperty() password: string;
}

export class ConfirmEmailDto {
  @ApiProperty() @IsNotEmpty() code: string;
  @ApiProperty() @IsEmail() email: string;
}

export class AccessTokenDto {
  @ApiProperty() accessToken: string;
}

export class UserRecordDto implements UserRecord {
  // eslint-disable-next-line @typescript-eslint/ban-types
  toJSON(): object {
    throw new Error('Method not implemented.');
  }
  @ApiProperty() uid: string;
  @ApiProperty({ required: false }) email?: string;
  @ApiProperty() emailVerified: boolean;
  @ApiProperty({ required: false }) displayName?: string;
  @ApiProperty({ required: false }) photoURL?: string;
  @ApiProperty({ required: false }) phoneNumber?: string;
  @ApiProperty() disabled: boolean;
  @ApiProperty() metadata: UserMetadata;
  @ApiProperty() providerData: UserInfo[];
  @ApiProperty({ required: false }) passwordHash?: string;
  @ApiProperty({ required: false }) passwordSalt?: string;
  @ApiProperty({ required: false }) customClaims?: { [key: string]: any };
  @ApiProperty({ required: false }) tenantId?: string;
  @ApiProperty({ required: false }) tokensValidAfterTime?: string;
  @ApiProperty({ required: false }) multiFactor?: MultiFactorSettings;
}

export class DecodedIdTokenDto implements DecodedIdToken {
  @ApiProperty() aud: string;
  @ApiProperty() auth_time: number;
  @ApiProperty({ required: false }) email?: string;
  @ApiProperty({ required: false }) email_verified?: boolean;
  @ApiProperty() exp: number;
  @ApiProperty() iat: number;
  @ApiProperty() iss: string;
  @ApiProperty({ required: false }) phone_number?: string;
  @ApiProperty({ required: false }) picture?: string;
  @ApiProperty() sub: string;
  @ApiProperty() uid: string;
  @ApiProperty()
  firebase: {
    [key: string]: any;
    identities: { [key: string]: any };
    sign_in_provider: string;
    sign_in_second_factor?: string;
    second_factor_identifier?: string;
    tenant?: string;
  };
}

export enum SocialSignInProviders {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}
