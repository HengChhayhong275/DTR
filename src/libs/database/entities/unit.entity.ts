import { CommonEntity } from "./common.entity";
import { UnitType } from "./unit-type.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('unit')
export class Unit extends CommonEntity{
    @Column('varchar')
    name: string

    @Column('varchar')
    abbre_name: string

    @Column('varchar')
    unitPin: string

    // unit_type_id (FK)
    @ManyToOne(() => UnitType)
    unitType: UnitType

    @ManyToOne(() => Unit)
    parentUnit: Unit
}