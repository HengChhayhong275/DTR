// src/db/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { UserCredential } from '../entities';

export default class UserCredentialSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "user-credential" RESTART IDENTITY CASCADE;');
    const repository = dataSource.getRepository(UserCredential);
    const password = await bcrypt.hash("test", 10)
    await repository.insert([{
      email: "super@test.com",
      password: password
    },
    {
      email: "staff1@gmail.com",
      password: password
    },
    {
      email: "staff2@gmail.com",
      password: password
    },
    {
      email: "staff3@gmail.com",
      password: password
    }]);
  }
}
