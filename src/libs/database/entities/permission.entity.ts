import { Column, Entity } from "typeorm";
import { CommonEntity } from "./common.entity";

@Entity('permission')
export class Permission extends CommonEntity{
  @Column('boolean', { default: 'false' })
  canCreate: boolean

  @Column('boolean', { default: 'false' })
  canRead: boolean

  @Column('boolean', { default: 'false' })
  canUpdate: boolean

  @Column('boolean', { default: 'false' })
  canDelete: boolean
}