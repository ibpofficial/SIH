import { Controller, Post, Body, Res, Req, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './jwt-auth.guard';
import { LoginInput, RegisterInput, LoginSchema, RegisterSchema } from '@freightiq/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any, @Res({ passthrough: true }) response: Response) {
    const validated = LoginSchema.parse(body);
    const { authResponse, refreshToken } = await this.authService.login(validated);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in HTTPS production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return authResponse;
  }

  @Public()
  @Post('register')
  async register(@Body() body: any, @Res({ passthrough: true }) response: Response) {
    const validated = RegisterSchema.parse(body);
    const { authResponse, refreshToken } = await this.authService.register(validated);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return authResponse;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies?.refreshToken;
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: any, @Res({ passthrough: true }) response: Response) {
    if (request.user?.id) {
      await this.authService.logout(request.user.id);
    }
    response.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async me(@Req() request: any) {
    return request.user;
  }
}
