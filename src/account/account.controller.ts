import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  UseGuards,
  Put,
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
  PhoneNumberLoginDto,
  RefreshTokenDto,
  ResetPassworDto,
  SocialLoginDto,
  SocialSignInProviders,
  UpdateProfileDto,
  UserProfile,
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
  async register(
    @Headers('Accept-Language') language: string,
    @Body() account: CreateAccountDto,
  ): Promise<AccessTokenDto> {
    return this.accountService.createAccount(account, language);
  }

  @Post('/login/email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async login(@Body() credentials: LoginDto): Promise<AccessTokenDto> {
    return this.accountService.login(credentials);
  }

  @Post('/login/facebookk')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async loginWithFacebook(
    @Body() credentials: SocialLoginDto,
  ): Promise<AccessTokenDto> {
    return this.accountService.socialSignIn(
      SocialSignInProviders.FACEBOOK,
      credentials.token,
    );
  }

  @Post('/login/phone')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async loginWithPhone(
    @Body() credentials: PhoneNumberLoginDto,
  ): Promise<AccessTokenDto> {
    return this.accountService.phoneNumberSignIn(credentials);
  }

  @Post('/login/google')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async loginWithGoogle(
    @Body() credentials: SocialLoginDto,
  ): Promise<AccessTokenDto> {
    return this.accountService.socialSignIn(
      SocialSignInProviders.GOOGLE,
      credentials.token,
    );
  }

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DecodedIdTokenDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getProfile(@User() user: DecodedIdTokenDto): Promise<UserProfile> {
    return this.accountService.getProfile(user.uid);
  }

  @Put('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async updateProfile(
    @User() user: DecodedIdTokenDto,
    @Body() data: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.accountService.updateProfile(user.uid, data);
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
  @ApiOkResponse({ type: UpdateProfileDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async confirmEmail(@Body() body: ConfirmEmailDto): Promise<UpdateProfileDto> {
    return this.accountService.confirmEmail(body);
  }

  @Post('/refreshToken')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async refreshToken(@Body() body: RefreshTokenDto): Promise<AccessTokenDto> {
    return this.accountService.refreshToken(body.refreshToken);
  }
}
