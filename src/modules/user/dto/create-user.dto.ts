import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { GenderType } from "src/libs/database/data-type";
import { Role } from "src/libs/database/entities";
import { Unit } from "src/libs/database/entities/unit.entity";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstNameKh: string

  @ApiProperty()
  @IsString()
  firstNameEn: string

  @ApiProperty()
  @IsString()
  lastNameKh: string

  @ApiProperty()
  @IsString()
  lastNameEn: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsOptional()
  @IsDate()
  dob: Date

  @ApiProperty()
  @IsEnum(GenderType)
  gender: GenderType

  @ApiProperty()
  @IsOptional()
  @IsString()
  nationality: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string


  @ApiProperty()
  @IsString()
  role: Role

  @ApiProperty()
  @IsString()
  unit: Unit
}
