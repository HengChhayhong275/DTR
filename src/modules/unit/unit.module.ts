import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from 'src/libs/database/entities/unit.entity';
import { UnitType } from 'src/libs/database/entities/unit-type.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Unit, UnitType])],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule { }
