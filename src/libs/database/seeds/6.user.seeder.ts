// src/db/seeds/user.seeder.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role, Unit, User, UserCredential } from '../entities';
import { GenderType } from '../data-type';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');
    const units = await dataSource.getRepository(Unit).find()
    const credentials = await dataSource.getRepository(UserCredential).find()
    const roles = await dataSource.getRepository(Role).find()
    const repository = dataSource.getRepository(User);
    await repository.insert([{
      firstNameEn: "super",
      lastNameEn: "test",
      firstNameKh: "ស៊ូពឺ",
      lastNameKh: "តេស្ត",
      dob: "12/26/2023",
      nationality: "Cambodian",
      address: "Phnom Penh",
      gender: GenderType.Male,
      phoneNumber: "012792811",
      unit: {
        id: units[3].id
      },
      role: {
        id: roles[0].id
      },
      credential: {
        id: credentials[0].id
      }
    },
    {
      firstNameEn: "staff1",
      lastNameEn: "test",
      firstNameKh: "បុគ្គលិក១",
      lastNameKh: "តេស្ត",
      dob: "12/26/2023",
      nationality: "Cambodian",
      address: "Phnom Penh",
      gender: GenderType.Male,
      phoneNumber: "012792812",
      unit: {
        id: units[2].id
      },
      role: {
        id: roles[1].id
      },
      credential: {
        id: credentials[1].id
      }
    },
    {
      firstNameEn: "staff2",
      lastNameEn: "test",
      firstNameKh: "បុគ្គលិក២",
      lastNameKh: "តេស្ត",
      dob: "12/26/2023",
      nationality: "Cambodian",
      address: "Phnom Penh",
      gender: GenderType.Male,
      phoneNumber: "012792813",
      unit: {
        id: units[1].id
      },
      role: {
        id: roles[2].id
      },
      credential: {
        id: credentials[2].id
      }
    },
    {
      firstNameEn: "staff3",
      lastNameEn: "test",
      firstNameKh: "បុគ្គលិក៣",
      lastNameKh: "តេស្ត",
      dob: "12/26/2023",
      nationality: "Cambodian",
      address: "Phnom Penh",
      gender: GenderType.Male,
      phoneNumber: "012792814",
      unit: {
        id: units[3].id
      },
      role: {
        id: roles[2].id
      },
      credential: {
        id: credentials[3].id
      }
    }]);
  }
}