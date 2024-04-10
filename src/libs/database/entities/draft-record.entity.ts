import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "./common.entity"
import { DocumentOriginInfo } from "./document-origin-info.entity";
import { Unit } from "./unit.entity";
import { Status } from "./status.entity";
import { RequestTransaction } from "./request-transaction.entity";

@Entity('draft-record')
export class DraftRecord extends CommonEntity {

    @Column('varchar')
    draft_type: string

    @ManyToOne(() => DocumentOriginInfo)
    documentOriginInfo: DocumentOriginInfo

    @ManyToOne(() => Unit)
    @JoinColumn({name: 'owner_unit'})
    owner_unit: Unit

    @OneToOne(() => Status)
    @JoinColumn({name: 'draft_status'})
    status: Status

    @ManyToOne(() => RequestTransaction, {nullable: true, eager: true})
    @JoinColumn({name: 'request_transaction'})
    request_transaction: RequestTransaction
}
