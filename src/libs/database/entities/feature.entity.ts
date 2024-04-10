import { Entity, Column } from "typeorm"
import { CommonEntity } from "./common.entity"

@Entity('feature')
export class Feature extends CommonEntity{
    @Column()
    name: string
}