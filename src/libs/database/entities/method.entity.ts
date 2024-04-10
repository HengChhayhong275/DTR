import { Column, Entity } from "typeorm";
import { CommonEntity } from "./common.entity";
import { MethodType } from "../data-type/method.type";

@Entity('method')
export class Method extends CommonEntity {
  @Column('enum', {enum: MethodType})
  name: MethodType
}
