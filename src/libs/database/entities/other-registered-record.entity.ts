import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { DocumentOriginInfo } from './document-origin-info.entity';
import { Unit } from './unit.entity';
import { DispatchTransaction } from './dispatch-transaction.entity';
import { Status } from './status.entity';

@Entity('other-registered-record')
export class OtherRegisteredRecord extends CommonEntity {

  // Document Detail Id (FK)
  @OneToOne(() => DocumentOriginInfo)
  @JoinColumn({name: 'documentOriginInfo'})
  documentOriginInfo: DocumentOriginInfo;

  // Unit Id (FK)
  @ManyToOne(() => Unit, { nullable: true })
  @JoinColumn({name: 'owner_unit'})
  owner_unit: Unit;

  @OneToOne(() => DispatchTransaction, { nullable: true, eager: true })
  @JoinColumn({
    name: 'transaction_id',
  })
  transaction: DispatchTransaction;

  @ManyToOne(() => Unit)
  @JoinColumn({name: 'requested_from'})
  requested_from: Unit

  @OneToOne(() => Status, {eager: true})
  @JoinColumn({
      name: 'record_status'
  })
  record_status: Status

  @Column({ default: false })
  isDeleted: boolean;
}
