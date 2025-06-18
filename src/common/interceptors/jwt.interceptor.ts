import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null;
    if (!token) {
      return next.handle();
    }
    return from(
      this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      }),
    ).pipe(
      switchMap((payload: any) => {
        return from(this.userService.findById(payload.id)).pipe(
          switchMap((user) => {
            if (!user) {
              throw new UnauthorizedException('Invalid token');
            }
            req.user = user;
            return next.handle();
          }),
        );
      }),
      catchError((err) => {
        ctx.getResponse().clearCookie('jwt', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
        throw new UnauthorizedException('Invalid or expired token');
      }),
    );
  }
}
