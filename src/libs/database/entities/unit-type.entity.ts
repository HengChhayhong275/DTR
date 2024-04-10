import { Column,  Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('unit-type')
export class UnitType extends CommonEntity{
  @Column({unique: true})
  name: string;
}