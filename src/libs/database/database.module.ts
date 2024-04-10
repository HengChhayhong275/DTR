import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from './typeorm-data-source';

@Module({
    imports: [
        TypeOrmModule.forRoot(dataSourceOption)
    ]
})
export class DatabaseModule { }
