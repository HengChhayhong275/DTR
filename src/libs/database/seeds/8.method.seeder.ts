import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Method } from '../entities/method.entity';
import { MethodType } from '../data-type/method.type';

export default class MethodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "method" RESTART IDENTITY CASCADE;');
    const method = dataSource.getRepository(Method);
    await method.insert([
      { name: MethodType.DROP_OFF },
      { name: MethodType.QR_CODE },
    ])
  }
}
