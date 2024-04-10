// src/db/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { DocumentType } from '../entities';

export default class DocumentSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "document-type" RESTART IDENTITY CASCADE;');
    const repository = dataSource.getRepository(DocumentType);
    await repository.insert([{
      name: "សារាចរណ៍",
    },
    {
      name: "ផ្តល់យោបល់",
    },
    {
      name: "ពិនិត្យ",
    },
    {
      name: "ឯកសាប្រញ៉ាប់",
    },
    {
      name: "សេចក្តីប្រកាស",
    }
    ]);
  }
}
