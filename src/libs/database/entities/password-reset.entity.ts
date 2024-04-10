import { Entity, JoinColumn, Column, ManyToOne } from "typeorm"
import { CommonEntity } from "./common.entity"
import { User } from "./user.entity"
import { IsString } from "class-validator"

@Entity('password-reset')
export class PasswordReset extends CommonEntity {

  @Column()
  @IsString()
  token: string

  @ManyToOne(() => User)
  @JoinColumn()
  user: User
}