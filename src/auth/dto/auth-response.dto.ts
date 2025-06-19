// login-response.dto.ts
import { UserDto } from '../../user/dto/user.dto';
import { Expose, Type } from 'class-transformer';

export class AuthResponseDto {
  @Type(() => UserDto)
  @Expose()
  user: UserDto;
  @Expose()
  token: string;
}
