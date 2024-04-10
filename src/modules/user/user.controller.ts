import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from 'src/common/decorator';

// @Public()
@ApiTags('users')
@Controller('users')

export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post('change-password')
  changePasword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(changePasswordDto)
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Roles([AppRoles.SUPER_ADMIN])
  // @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() filterParams: FilterUserDto) {
    return this.userService.findAll(filterParams);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
