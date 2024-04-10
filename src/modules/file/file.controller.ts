/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, ParseUUIDPipe } from '@nestjs/common';
import { LocalFileInterceptor } from 'src/config/file.config';
import { CreateFileDto } from './dto/create-file.dto';
import { FileService } from './file.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileService: FileService,
    ) {}

  @Post('upload')
  @UseInterceptors(LocalFileInterceptor({
    fieldName: 'file'
  }))
  uploadSingleFile(@UploadedFile() file: Express.Multer.File): Promise<CreateFileDto> {
    return this.fileService.uploadSingleFile(file);
  }

  @Get(':filename')
  viewImage(@Param('filename') filename: string, @Res() res) : any {
    return res.sendFile(this.fileService.viewImage(filename))
  }

  @Get('test/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.fileService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() UpdateFileDto: UpdateFileDto) {
  //   return this.fileService.update(+id, UpdateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.fileService.remove(+id);
  // }
}
