import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UnitModule } from './modules/unit/unit.module';
import { DatabaseModule } from './libs/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { UnitTypeModule } from './modules/unit/unit-types/unit-types.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SelfRegisteredRecordModule } from './modules/document/self-registered-record/self-registered-record.module';
import { DocumentTypeModule } from './modules/document/document-type/document-type.module';
import { ReceivedRecordModule } from './modules/document/received-record/received-record.module';
import { DispatchModule } from './modules/document/dispatch/dispatch.module';
import { DraftRecordModule } from './modules/draft-record/draft-record.module';
import { FileModule } from './modules/file/file.module';
import { AcceptingRecordModule } from './modules/document/accepting-record/accepting-record.module';
import { OtherRegisteredRecordModule } from './modules/document/other-registered-record/other-registered-record.module';
import { DropOffRecordModule } from './modules/document/drop-off-record/drop-off-record.module';
import { DocumentOriginInfoModule } from './modules/document/document-origin-info/document-origin-info.module'; // Import the module

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UnitModule,
    UnitTypeModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    SelfRegisteredRecordModule,
    DocumentTypeModule,
    ReceivedRecordModule,
    DispatchModule,
    DraftRecordModule,
    FileModule,
    AcceptingRecordModule,
    OtherRegisteredRecordModule,
    DropOffRecordModule,
    DocumentOriginInfoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    }
  ]
})
export class AppModule { }
