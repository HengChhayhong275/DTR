import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { UnitType } from "src/libs/database/entities/unit-type.entity";

export class CreateUnitDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    abbre_name: string;

    @ApiProperty()
    @IsString()
    unitPin: string;

    @ApiProperty()
    @IsString()
    unitType: UnitType;

    @ApiProperty()
    @IsString()
    @IsOptional()
    parentUnit: UnitType;
}