import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { PasswordReset, Role, Unit, User } from 'src/libs/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { promisify } from 'util';
import * as crypto from 'crypto'
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordReset: Repository<PasswordReset>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }

  //Generate reset password token
  async generateToken(): Promise<string> {
    const randomBytesAsync = promisify(crypto.randomBytes);
    try {
      const buffer = await randomBytesAsync(48);
      return buffer.toString('hex');
    } catch (error) {
      // Handle error appropriately
      throw new Error('Token generation failed');
    }
  }

  //Implete forgot password service
  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const { email } = forgotPassword
    const url = this.configService.getOrThrow('FRONTEND_BASE_URL')
    if (!email) {
      return new BadRequestException({
        message: "Email Field is required."
      })
    }
    try {
      //Check if user with the provided email exists
      const user = await this.usersRepository.findOne({
        where: {
          credential: {
            email: forgotPassword.email
          }
        },
        relations: {
          credential: true
        }
      })
      if (user) {
        const token = await this.generateToken()
        const passwordReset = new PasswordReset()
        passwordReset.user = user
        passwordReset.token = token
        // Insert user and token into the database
        await this.passwordReset.insert(passwordReset)
        this.mailerService
          .sendMail({
            to: user.credential.email,
            from: 'noreply@mptc.gov.kh',
            subject: 'Reset Password',
            template: './index', // The `.pug` or `.hbs` extension is appended automatically.
            context: {  // Data to be sent to template engine.
              firstname: user.firstNameEn,
              lastname: user.lastNameEn,
              link: `${url}/${passwordReset.token}/forgot-password`,
            },
          })
          .then((success) => {
            console.log(success)
          })
          .catch((err) => {
            console.log(err)
          });
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getTokens(id: string, email: string, role: Role, unit: Unit) {
    const payload = {
      id,
      email,
      role,
      unit
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '300s',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '1d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRt(id: string, rt: string) {
    await this.usersRepository.update(id, { rt })
  }

  async login(loginUserDto: LoginUserDto, response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    const { email, password } = loginUserDto
    const user = await this.usersRepository.findOne({
      where: {
        credential: {
          email
        }
      }, relations: {
        role: true,
        unit: true,
        credential: true
      }
    })
    if (user) {
      const matched = await bcrypt.compare(password, user.credential.password)
      if (!matched) {
        throw new UnauthorizedException({
          message: "Incorrect Email or Password!"
        })
      }

      const { accessToken, refreshToken } = await this.getTokens(
        user.id,
        user.credential.email,
        user.role,
        user.unit
      );

      await this.updateRt(user.id, refreshToken)

      response.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return {
        accessToken,
        role: user?.role,
        unit: user?.unit
      }
    }
    throw new UnauthorizedException({
      message: "Incorrect Email or Password!"
    })
  }

  async logout(id: string, request: Request, response: Response) {
    const cookies = request?.cookies;
    if (cookies?.jwt) {
      response.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }
    try {
      await this.usersRepository.update({
        id
      }, { rt: null });
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  async getProfile(id: string) {

    try {
      const user = await this.usersRepository.findOne({
        where: {
          id
        },
        relations: {
          unit: true,
          role: true,
        }
      });

      if(user?.rt){
        delete user.rt;
      }
      
      return user;
    } catch (error) {
      console.log(error);
    }

  }

  async refreshToken(request: Request, response: Response) {
    const cookies = request.cookies;
    if (!cookies?.jwt) throw new UnauthorizedException('Access Denied.');
    const refreshToken = cookies.jwt;
    const user = await this.usersRepository.findOne({
      where: {
        rt: refreshToken,
      },
      relations: {
        credential: true
      }
    });
    if (!user) {
      throw new UnauthorizedException('Access Denied');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (payload?.id !== user.id) {
        throw new UnauthorizedException('Access Denied');
      }
    } catch (error) {
      await this.usersRepository.update({
        id: user.id
      }, { rt: null });
      response.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      throw new UnauthorizedException('Access Denied');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.credential.email,
        role: user.role,
        unit: user.unit
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '300s',
      },
    );
    return { accessToken };
  }
}
