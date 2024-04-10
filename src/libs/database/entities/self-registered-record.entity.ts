import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "./common.entity";
import { DocumentOriginInfo } from "./document-origin-info.entity";
import { Unit } from "./unit.entity";
import { DispatchTransaction } from "./dispatch-transaction.entity";
import { Status } from "./status.entity";

@Entity('self-registered-record')
export class SelfRegisteredRecord extends CommonEntity {

    // Document Detail Id (FK)
    @OneToOne(() => DocumentOriginInfo, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'documentOriginInfo'})
    documentOriginInfo: DocumentOriginInfo

    @ManyToOne(() => Unit, {nullable: true})
    @JoinColumn({name: 'requested_by'})
    requested_by: Unit

    // Unit Id (FK) : Self Registered Record Owner Unit
    @ManyToOne(() => Unit, {nullable: true})
    @JoinColumn({name: 'owner_unit'})
    owner_unit: Unit

    @OneToOne(() => Status, {eager: true})
    @JoinColumn({
    name: 'record_status'
    })
    record_status: Status

    @OneToOne(() => DispatchTransaction, {nullable: true, eager: true})
    @JoinColumn({
    name: 'transaction_id'
    })
    transaction: DispatchTransaction

    

    @Column({ default: false })
    isDeleted: boolean
}
