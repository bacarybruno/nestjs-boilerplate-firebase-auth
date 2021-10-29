import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user.decorator';
import { AccountService } from './account.service';
import {
  AccessTokenDto,
  ConfirmEmailDto,
  CreateAccountDto,
  DecodedIdTokenDto,
  InitResetPasswordDto,
  LoginDto,
  ResetPassworDto,
  SocialLoginDto,
  SocialSignInProviders,
  UserRecordDto,
  VerifyResetPassworDto,
} from './account.types';

@Controller('account')
@ApiTags('Account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async register(@Body() account: CreateAccountDto): Promise<AccessTokenDto> {
    const accessToken = await this.accountService.createAccount(account);
    return { accessToken };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async login(@Body() credentials: LoginDto): Promise<AccessTokenDto> {
    const accessToken = await this.accountService.login(credentials);
    return { accessToken };
  }

  @Post('/login/facebookk')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async loginWithFacebook(
    @Body() credentials: SocialLoginDto,
  ): Promise<AccessTokenDto> {
    const accessToken = await this.accountService.socialSignIn(
      SocialSignInProviders.FACEBOOK,
      credentials.token,
    );
    return { accessToken };
  }

  @Post('/login/google')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async loginWithGoogle(
    @Body() credentials: SocialLoginDto,
  ): Promise<AccessTokenDto> {
    const accessToken = await this.accountService.socialSignIn(
      SocialSignInProviders.GOOGLE,
      credentials.token,
    );
    return { accessToken };
  }

  @Post('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DecodedIdTokenDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getProfile(
    @User() user: DecodedIdTokenDto,
  ): Promise<DecodedIdTokenDto> {
    return user;
  }

  @Post('/resetPassword/init')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Boolean })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async sendResetPasswordEmail(
    @Body() body: InitResetPasswordDto,
  ): Promise<void> {
    return this.accountService.sendResetPasswordEmail(body.email);
  }

  @Post('/resetPassword/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Boolean })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async verifyResetPasswordCode(
    @Body() body: VerifyResetPassworDto,
  ): Promise<boolean> {
    return this.accountService.verifyResetPasswordCode(body);
  }

  @Post('/resetPassword/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: 'Bad request' })
  async resetPassword(@Body() body: ResetPassworDto): Promise<void> {
    return this.accountService.resetPassword(body);
  }

  @Post('/email/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserRecordDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async confirmEmail(@Body() body: ConfirmEmailDto): Promise<UserRecordDto> {
    return this.accountService.confirmEmail(body);
  }
}
