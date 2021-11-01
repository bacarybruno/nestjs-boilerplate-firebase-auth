import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

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
  @ApiProperty() refreshToken: string;
}

export class RefreshTokenDto {
  @ApiProperty() refreshToken: string;
}

export class DecodedIdTokenDto {
  @ApiProperty({ required: false }) email?: string;
  @ApiProperty({ required: false }) email_verified?: boolean;
  @ApiProperty({ required: false }) phone_number?: string;
  @ApiProperty({ required: false }) picture?: string;
  @ApiProperty() uid: string;
}

export enum SocialSignInProviders {
  FACEBOOK = 'facebook.com',
  GOOGLE = 'google.com',
}

export interface UserProfile {
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
}

export class UpdateProfileDto implements UserProfile {
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() phoneNumber?: string;
  @ApiProperty({ required: false }) @IsOptional() displayName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUrl() photoURL?: string;
}
