import { Module } from '@nestjs/common';
import { UnitTypeService } from './unit-types.service';
import { UnitTypeController } from './unit-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitType } from 'src/libs/database/entities/unit-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnitType])],
  controllers: [UnitTypeController],
  providers: [UnitTypeService],
})
export class UnitTypeModule { }
