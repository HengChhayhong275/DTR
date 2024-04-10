import { Module } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeController } from './document-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentType } from 'src/libs/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType])],
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService],
})
export class DocumentTypeModule { }
