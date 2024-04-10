import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) { }

  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateUnitDto) {
    return this.unitService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unitService.remove(id);
  }
}
