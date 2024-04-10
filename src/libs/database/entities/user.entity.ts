import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { GenderType } from "../data-type";
import { CommonEntity } from "./common.entity";
import { Role } from "./role.entity";
import { Unit } from "./unit.entity";
import { UserCredential } from "./user-credential.entity";

@Entity('user')
export class User extends CommonEntity{
  @Column('varchar')
  firstNameKh: string

  @Column('varchar')
  firstNameEn: string

  @Column('varchar')
  lastNameKh: string

  @Column('varchar')
  lastNameEn: string

  @Column('enum', { enum: GenderType, nullable: true })
  gender: GenderType

  @Column('varchar', { nullable: true })
  nationality: string | null

  @Column('varchar', { nullable: true })
  address: string | null

  @Column('date', { nullable: true })
  dob: Date | null


  @OneToOne(() => UserCredential, (userCredentials) => userCredentials.user, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  credential: UserCredential

  @Column('varchar', { nullable: true, unique: true })
  phoneNumber: string | null

  @Column('integer', { default: 0 })
  attempts: number;

  @ManyToOne(() => Role, {
    eager: true
  })
  role: Role

  @ManyToOne(() => Unit, {
    eager: true
  })
  unit: Unit

  @Column('varchar', { nullable: true })
  rt: string
}