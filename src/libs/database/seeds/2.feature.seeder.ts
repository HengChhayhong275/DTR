// src/db/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Feature } from '../entities/feature.entity';

export default class FeatureSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "feature" RESTART IDENTITY CASCADE;');
    const repository = dataSource.getRepository(Feature);
    await repository.insert([{
      name: "user",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "role",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "document",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "document-type",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "unit",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    
   ]);
  }
}
