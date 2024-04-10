import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { ApiTags } from '@nestjs/swagger';
import { DocumentTypeService } from './document-type.service';

@ApiTags('document-types')
@Controller('document-types')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) { }

  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypeService.create(createDocumentTypeDto);
  }

  @Get()
  findAll() {
    return this.documentTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return this.documentTypeService.update(id, updateDocumentTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentTypeService.remove(id);
  }
}
