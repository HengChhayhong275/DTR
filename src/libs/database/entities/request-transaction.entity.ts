import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "./common.entity";
import { Status } from "./status.entity";
import { Unit } from "./unit.entity";

@Entity('request-transaction')
export class RequestTransaction extends CommonEntity {

    @OneToOne(() => Status, {eager: true})
    @JoinColumn({
        name: 'transaction_status'
    })
    transaction_status: Status

    @ManyToOne(() => Unit, {nullable: true})
    @JoinColumn({
        name: 'requested_from'
    })
    requested_from: Unit

    @ManyToOne(() => Unit, {nullable: true})
    @JoinColumn({
        name: 'requested_by'
    })
    requested_by: Unit
}