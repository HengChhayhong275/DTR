import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddFeatureToRoleDto } from './dto/add-feature-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id/add-feature')
  setRoleFeature(@Param('id', new ParseUUIDPipe()) id: string, @Body() addFeatureToRoleDto: AddFeatureToRoleDto) {
    return this.roleService.setRoleFeature(id, addFeatureToRoleDto);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roleService.remove(id);
  }
}
