import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset, User } from 'src/libs/database/entities';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'


@Module({
  imports: [    TypeOrmModule.forFeature([User, PasswordReset]),
    JwtModule.register({}),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow('MAIL_HOST'),
          port: configService.getOrThrow('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.getOrThrow('MAIL_USER'),
            pass: configService.getOrThrow('MAIL_PASS'),
          },
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService]
    })],
  providers: [AuthService, AtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
