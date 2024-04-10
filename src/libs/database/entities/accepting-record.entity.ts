import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Unit } from "./unit.entity";
import { CommonEntity } from "./common.entity";
import { DocumentOriginInfo } from "./document-origin-info.entity";
import { User } from "./user.entity";
import { DispatchTransaction } from "./dispatch-transaction.entity";

@Entity('accepting-record')
export class AcceptingRecord extends CommonEntity {
  // Document Detail Id (FK)
  @ManyToOne(() => DocumentOriginInfo)
  documentOriginInfo: DocumentOriginInfo

  @ManyToOne(() => User)
  @JoinColumn({ name: "receiver" })
  receiver: User

  @ManyToOne(() => User)
  @JoinColumn({ name: "sender" })
  sender: User

  @OneToOne(() => DispatchTransaction, { nullable: true, eager: true })
  @JoinColumn({
    name: 'transaction_id'
  })
  transaction: DispatchTransaction

  // Unit Id (FK) : Owner of received record
  @ManyToOne(() => Unit)
  unit: Unit

}
