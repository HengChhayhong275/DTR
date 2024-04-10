import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

config()
const configService = new ConfigService()

export const dataSourceOption: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  database: configService.getOrThrow('POSTGRES_DB'),
  entities: [join(process.cwd(), 'dist/**/*.entity.js')],
  useUTC: false,
  // seeds: [join(process.cwd(), 'dist/**/*.seeder.js')],
  seeds: ['dist/libs/database/seeds/**/*.js'],
  // Do not use synchronize true in real project
  synchronize: true //this will make changes in the db when you change something in entities file,
}

const typeOrmDataSource = new DataSource(dataSourceOption);
export default typeOrmDataSource;
