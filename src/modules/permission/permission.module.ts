import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { FeatureModule } from './feature/feature.module';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [FeatureModule],
})
export class PermissionModule { }
