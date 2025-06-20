import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { PropertyModule } from './property/property.module';
import * as mysql from 'mysql2/promise';
import { Property } from './property/property.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // ✅ Ensure database exists
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<number>('DB_PORT');
        const user = configService.get<string>('DB_USERNAME');
        const password = configService.get<string>('DB_PASSWORD');
        const dbName = configService.get<string>('DB_DATABASE');

        const connection = await mysql.createConnection({
          host,
          port,
          user,
          password,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.end();

        console.log(`✅ Database '${dbName}' ensured`);

        return {
          type: 'mysql',
          host,
          port,
          username: user,
          password,
          database: dbName,
          entities: [User, Property],
          synchronize: true,
        };
      },
    }),

    AuthModule,
    UserModule,
    PropertyModule,
  ],
})
export class AppModule {}
