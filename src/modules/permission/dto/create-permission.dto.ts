import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsBoolean()
  canRead: boolean

  @ApiProperty()
  @IsBoolean()
  canCreate: boolean

  @ApiProperty()
  @IsBoolean()
  canUpdate: boolean

  @ApiProperty()
  @IsBoolean()
  canDelete: boolean
}
