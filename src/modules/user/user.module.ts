import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset, Role, User } from 'src/libs/database/entities';
import { UserCredential } from 'src/libs/database/entities/user-credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserCredential, PasswordReset])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
