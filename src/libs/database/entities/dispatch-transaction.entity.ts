import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "./common.entity";
import { Status } from "./status.entity";
import { Unit } from "./unit.entity";
import { User } from "./user.entity";
import { MethodType } from "../data-type/method.type";

@Entity('dispatched-transaction')
export class DispatchTransaction extends CommonEntity {
    @Column({ nullable: true })
    pin: number

    @Column('enum' , {enum: MethodType, default: MethodType.QR_CODE})
    method: MethodType

    @ManyToOne(() => Unit, {nullable: true})
    @JoinColumn({
        name: 'receiving_unit_id'
    })
    receiving_unit: Unit

    @ManyToOne(() => User, {eager: true})
    @JoinColumn({
        name: 'sender_id'
    })
    sender: User

    @ManyToOne(() => User, {nullable: true, eager: true})
    @JoinColumn({
        name: 'receiver_id'
    })
    receiver: User


    @OneToOne(() => Status, {eager: true})
    @JoinColumn({
        name: 'transaction_status_id'
    })
    transaction_status: Status
}
