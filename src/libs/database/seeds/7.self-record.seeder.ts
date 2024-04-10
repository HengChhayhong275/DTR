import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { DocumentOriginInfo, DocumentType, SelfRegisteredRecord, Status, User } from '../entities';

export default class SelfRegisteredRecordSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "accepting-record" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "dispatched-transaction" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "document-origin-info" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "status" RESTART IDENTITY CASCADE;');
    const users = await dataSource.getRepository(User).find()
    const docTypes = await dataSource.getRepository(DocumentType).find()


    const statusRepo = dataSource.getRepository(Status);
    await statusRepo.insert([
      {draft: true},
      {draft: true},
      {draft: true},
    ])

    const status = await statusRepo.find()

    const docOriginRepo = dataSource.getRepository(DocumentOriginInfo);
    await docOriginRepo.insert([{
      doc_sequence_number: '000001',
      doc_given_number: 'ICT000001',
      published_date: '01/01/2023',
      other: 'Blah blah blah',
      documentType: docTypes[0],
      summary: 'Request for intern money',
      num_of_copies: 5,
      created_by: users[1],
    },
    {
      doc_sequence_number: '000002',
      doc_given_number: 'ICT000002',
      published_date: '01/01/2023',
      other: 'Blah blah blah',
      documentType: docTypes[1],
      summary: 'Request for sleep',
      num_of_copies: 3,
      created_by: users[1]
    },
    {
      doc_sequence_number: '000003',
      doc_given_number: 'ICT000003',
      published_date: '01/01/2023',
      other: 'Blah blah blah',
      documentType: docTypes[2],
      summary: 'Request for what?',
      num_of_copies: 2,
      created_by: users[1]
    },
    ]);
    const info = await dataSource.getRepository(DocumentOriginInfo).find()
    await dataSource.query('TRUNCATE "self-registered-record" RESTART IDENTITY CASCADE;');
    const selfRecord = dataSource.getRepository(SelfRegisteredRecord);
    await selfRecord.insert([
      {
        documentOriginInfo: info[0],
        owner_unit: info[0].created_by.unit,
        record_status: status[0]
      },
      {
        documentOriginInfo: info[1],
        owner_unit: info[1].created_by.unit,
        record_status: status[1]
      },
      {
        documentOriginInfo: info[2],
        owner_unit: info[2].created_by.unit,
        record_status: status[2]
      },]
    );

  }
}
