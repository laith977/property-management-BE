import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { token, user } = await this.authService.register(dto);
      this.setAuthCookie(res, token);

      const { password, ...safeUser } = user;
      return { user: safeUser, token };
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { token, user } = await this.authService.login(dto);
      this.setAuthCookie(res, token);

      const { password, ...safeUser } = user;
      return { user: safeUser, token };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid credentials');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }

  private setAuthCookie(res: Response, token: string) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
