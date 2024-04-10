import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/libs/database/entities';
import { Repository } from 'typeorm';
const path = require('path')
const fs = require ('fs')

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private readonly FileRepository: Repository<File>
  ) {}

  async uploadSingleFile(file: Express.Multer.File): Promise<CreateFileDto> {
    if (!file) {
      throw new BadRequestException('File is required !');
    }

    const newFile = new File()
    newFile.filename = file.originalname
    newFile.newFilename = file.filename
    newFile.path = this.configService.get<string>('FILE_IMAGE_BASE_URL') + file.filename
    newFile.size = file.size;

    await this.FileRepository.save(newFile)

    return {
      filename: file.originalname,
      newFilename: file.filename,
      path: this.configService.get<string>('FILE_IMAGE_BASE_URL') + file.filename,
      size: file.size,
      extension: path.extname(file.originalname),
    } as CreateFileDto;
  }

  isImageByNameExist = (filename: string): boolean => {
    const dir = this.configService.get<string>('FILE_IMAGE_LOCATION');
    const files = fs.readdirSync(dir)

    for(const file of files) {
      if(file === filename) {
        return true
      }
    }
    return false;;
  }

  viewImage(filename: string): string {
    if(this.isImageByNameExist(filename)) {
      return join(this.configService.get<string>('FILE_IMAGE_LOCATION'), filename)
    }

    throw new BadRequestException(`Image ${filename} not found !`)
  }

  findOne(id: string) {
    return this.FileRepository.findOne({where: {id}})
  }

  update(id: number, UpdateFileDto: UpdateFileDto) {
    return `This action updates a #${id} fileUpload`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileUpload`;
  }
}
