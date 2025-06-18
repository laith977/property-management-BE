import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/get-user.decorator';
import { JwtGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }
}
