import { Column, Entity } from "typeorm";
import { CommonEntity } from "./common.entity";

@Entity('file')
export class File extends CommonEntity {
    @Column()
    filename: string

    @Column()
    newFilename: string

    @Column()
    path: string

    @Column()
    size: number
}
