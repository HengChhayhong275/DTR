// src/db/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../entities';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "role" RESTART IDENTITY CASCADE;');
    const repository = dataSource.getRepository(Role);
    await repository.insert([{
      name: "SUPER_ADMIN",
      description: "This user manages the whole system",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "UNIT_LEAD",
      description: "This user is for the lead in the each office where they can manage UNIT_ADMIN",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "UNIT_ADMIN",
      description: "This user is for the administrator in the each office where they can create, update, delete, read both the dispatched and received document records",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "UNIT_USER",
      description: "This user is for the member inside each office",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    }]);
  }
}
