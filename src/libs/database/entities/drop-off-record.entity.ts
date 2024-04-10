import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Unit } from "./unit.entity";
import { CommonEntity } from "./common.entity";
import { DocumentOriginInfo } from "./document-origin-info.entity";
import { User } from "./user.entity";
import { DispatchTransaction } from "./dispatch-transaction.entity";

@Entity('drop-off-record')
export class DropOffRecord extends CommonEntity {
  // Document Detail Id (FK)
  @ManyToOne(() => DocumentOriginInfo)
  documentOriginInfo: DocumentOriginInfo

  @ManyToOne(() => Unit)
  @JoinColumn({name: "receiving_unit"})
  receiving_unit: Unit

  @ManyToOne(() => User)
  @JoinColumn({name: "sender"})
  sender: User

  @ManyToOne(() => DispatchTransaction)
  @JoinColumn({name: 'transaction_id'})
  transaction: DispatchTransaction

}
