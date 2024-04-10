import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Unit } from "./unit.entity";
import { CommonEntity } from "./common.entity";
import { DocumentOriginInfo } from "./document-origin-info.entity";
import { User } from "./user.entity";

@Entity('received-record')
export class ReceivedRecord extends CommonEntity {
    // Document Detail Id (FK)
    @ManyToOne(() => DocumentOriginInfo)
    @JoinColumn({name: "documentOriginInfo"})
    documentOriginInfo: DocumentOriginInfo

    // Unit Id (FK) : Owner of received record
    @ManyToOne(() => Unit)
    @JoinColumn({name: "unit"})
    unit: Unit

    @ManyToOne(() => Unit)
    @JoinColumn({name: "from_unit"})
    fromUnit: Unit

    @ManyToOne(() => User, {nullable: true})
    @JoinColumn({name: "receiver"})
    receiver: User

    @ManyToOne(() => User, {nullable: true})
    @JoinColumn({name: "sender"})
    sender: User

    @Column('date', { nullable: true })
    acceptedDate: Date
}
