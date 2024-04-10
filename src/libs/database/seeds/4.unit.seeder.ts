// src/db/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UnitType } from '../entities/unit-type.entity';
import { Unit } from '../entities';

export default class UnitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "unit-type" RESTART IDENTITY CASCADE;');
    const unitTypeRepo = dataSource.getRepository(UnitType);
    await unitTypeRepo.insert([{
      name: "Ministry",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "Head Unit",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "Unit",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },
    {
      name: "Office",
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`
    },]);
    const unitTypes = await dataSource.getRepository(UnitType).find()
    await dataSource.query('TRUNCATE "unit" RESTART IDENTITY CASCADE;');
    const unitRepo = dataSource.getRepository(Unit);
    await unitRepo.insert(
      {
        name: "Ministry Of Post and Telecommunications",
        abbre_name: "MTPC",
        unitPin: "MPTC1001",
        unitType: unitTypes[0]
      },
    );
    let unit = await dataSource.getRepository(Unit).find()
    await unitRepo.insert({
      name: "General Department of Information and Communication Technology",
      abbre_name: "GDICT",
      unitPin: "GDICT1001",
      unitType: unitTypes[1],
      parentUnit: unit[0]
    })
    unit = await dataSource.getRepository(Unit).find()
    await unitRepo.insert({
      name: "Department of ICT Industry",
      abbre_name: "ICT",
      unitPin: "ICT1001",
      unitType: unitTypes[2],
      parentUnit: unit[1]
    })
    unit = await dataSource.getRepository(Unit).find()

    await dataSource.getRepository(Unit).insert({
      name: "IT Operation and System Quality Assurance",
      abbre_name: "ITO",
      unitPin: "ITO1001",
      unitType: unitTypes[3],
      parentUnit: unit[2]
    })

  }
}
