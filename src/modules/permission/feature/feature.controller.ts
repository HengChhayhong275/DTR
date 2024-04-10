import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureService } from './feature.service';

@Controller('features')
export class FeatureController {
  constructor(private readonly featuresService: FeatureService) { }

  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  findAll() {
    return this.featuresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.featuresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featuresService.update(id, updateFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.featuresService.remove(id);
  }
}
