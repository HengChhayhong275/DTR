import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadController } from './file.controller';
import { FileService } from './file.service';
import { File } from 'src/libs/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FileUploadController],
  providers: [FileService],
})
export class FileModule {}
