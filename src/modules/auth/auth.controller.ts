import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Response,Request } from 'express';
import { GetCurrentUserId, Public } from 'src/common/decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService)
     { }

  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: Response,) {
    return this.authService.login(loginUserDto, response)
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPassword)
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() id: string,@Req() request: Request, @Res({ passthrough: true }) response: Response,) {
    return this.authService.logout(id,request,response);
  }

  @Get('me')
  getProfile(@GetCurrentUserId() id: string) {
    return this.authService.getProfile(id);
  }

  @Public()
  @Get('refresh')
  refreshToken(@Req() request: Request,  @Res({ passthrough: true }) response: Response) {
    return this.authService.refreshToken(request,response);
  }

  
}
