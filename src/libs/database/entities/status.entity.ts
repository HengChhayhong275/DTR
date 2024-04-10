import { Entity, Column } from "typeorm"
import { CommonEntity } from "./common.entity"

@Entity('status')
export class Status extends CommonEntity {
    @Column({ default: false })
    draft: boolean

    @Column({ default: false })
    pending: boolean

    @Column({ default: false })
    dispatched: boolean

    @Column({ default: false })
    accepted: boolean

    @Column({ default: false })
    rejected: boolean
}