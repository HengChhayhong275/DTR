import { Column, Entity, ManyToOne } from 'typeorm';
import { DocumentType } from './document-type.entity';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity('document-origin-info')
export class DocumentOriginInfo extends CommonEntity {
  
  // Format 000001 and should auto generate and increment
  @Column({ nullable: true, length: 6 })
  doc_sequence_number: string;

  // combination: unit_pin + doc_sequence_number. Ex: MPTC000001
  @Column('varchar', {nullable: true})
  doc_given_number: string

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @Column('date', { nullable: false })
  published_date: Date;

  // document type id (FK)
  @ManyToOne(() => DocumentType, { eager: true })
  documentType: DocumentType;

  @Column('varchar')
  summary: string;

  @Column('integer')
  num_of_copies: number

  @Column('varchar', {nullable: true})
  main_doc_file: string

  @Column('varchar', {nullable: true})
  referral_doc_file: string

  @Column('varchar', { nullable: true })
  other: string;

}
