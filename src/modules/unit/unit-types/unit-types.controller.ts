import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UnitTypeService } from './unit-types.service';
import { CreateUnitTypeDto } from './dto/create-unit-type.dto';
import { UpdateUnitTypeDto } from './dto/update-unit-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('unit-types')
@Controller('unit-types')
export class UnitTypeController {
  constructor(private readonly unitTypeService: UnitTypeService) { }

  @Post()
  create(@Body() createDto: CreateUnitTypeDto) {
    return this.unitTypeService.create(createDto);
  }

  @Get()
  findAll() {
    return this.unitTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unitTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateUnitTypeDto) {
    return this.unitTypeService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unitTypeService.remove(id);
  }
}
