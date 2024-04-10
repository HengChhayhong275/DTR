import { Column, Entity, OneToOne } from "typeorm";
import { CommonEntity } from "./common.entity";
import { User } from "./user.entity";


@Entity('user-credential')
export class UserCredential extends CommonEntity{

  @Column('varchar', { unique: true })
  email: string

  @Column('varchar')
  password: string

  @OneToOne(() => User, user => user.credential, {
    onDelete: "CASCADE"
  })
  user: User
}