// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({
    }),
    UserModule,
  ],
  providers: [JwtInterceptor],
  exports: [JwtInterceptor],
})
export class CommonModule {}
