import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Feature } from "typeorm";

export class AddFeatureToRoleDto {
  @ApiProperty()
  @IsString()
  features: Feature[]
}
