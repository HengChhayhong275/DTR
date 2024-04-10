import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitTypeDto } from './dto/create-unit-type.dto';
import { UpdateUnitTypeDto } from './dto/update-unit-type.dto';
import { Repository } from 'typeorm';
import { UnitType } from 'src/libs/database/entities/unit-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UnitTypeService {
  constructor(
    @InjectRepository(UnitType)
    private readonly unitTypeRepository: Repository<UnitType>,
  ) { }

  async create(createDto: CreateUnitTypeDto) {
    try {
      if (await this.unitTypeRepository.findOne({
        where: {
          name: createDto.name
        }
      })) {
        console.log("Unit Type already existed !")
      }
      else {
        const newUnitType = await this.unitTypeRepository.save(createDto);
        return {
          newUnitType,
          message: "New Unit Type created !"
        }
      }
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    const unitType = await this.unitTypeRepository.find();

    if (!unitType) {
      throw new NotFoundException({
        message: "No Unit Type Found !"
      })
    }

    return unitType
  }

  async findOne(id: string) {
    const unitType = await this.unitTypeRepository.findOne({ where: { id } })

    if (!unitType) {
      throw new NotFoundException();
    }

    return unitType
  }

  async findByName(name: string) {
    const unitType = await this.unitTypeRepository.findOne({ where: { name } })

    if (!unitType) {
      throw new NotFoundException();
    }

    return unitType
  }

  async update(id: string, updateDto: UpdateUnitTypeDto) {
    const updatedUnitTypeDto = await this.unitTypeRepository.update(id, updateDto)
    return { message: "Update Successful !", updatedUnitTypeDto };
  }

  async remove(id: string) {
    try {
      await this.unitTypeRepository.delete(id)
      return { message: "Successfully Deleted !" }
    } catch (error) {
      throw error
    }
  }
}
