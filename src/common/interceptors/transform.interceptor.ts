import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
      catchError((err) => {
        const status =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          err instanceof HttpException
            ? err.getResponse()
            : 'Internal server error';

        return throwError(() => {
          return new HttpException(
            {
              success: false,
              statusCode: status,
              message:
                typeof message === 'string'
                  ? message
                  : (message as any).message,
            },
            status,
          );
        });
      }),
    );
  }
}
