import { Column, Entity} from "typeorm";
import { CommonEntity } from "./common.entity";

@Entity('document-type')
export class DocumentType extends CommonEntity{
    @Column('varchar', { unique: true })
    name: string;
}
