import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/libs/database/entities';
import { Feature } from 'src/libs/database/entities/feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Feature])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule { }
