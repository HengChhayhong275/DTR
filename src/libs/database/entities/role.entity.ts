import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Feature } from "./feature.entity";
import { CommonEntity } from "./common.entity";

@Entity('role')
export class Role extends CommonEntity{

  @Column('varchar', { unique: true })
  name: string

  @Column('varchar', { nullable: true })
  description: string

  @ManyToMany(() => Feature)
  @JoinTable()
  features: Feature[]
}