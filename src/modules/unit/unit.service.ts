import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/libs/database/entities/unit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) { }

  async create(createUnitDto: CreateUnitDto) {
    const unit = await this.unitRepository.findOne({
      where: {
        name: createUnitDto.name
      }
    })
    if (unit) {
      throw new ConflictException({ message: "Unit already existed !" })
    }

    try {
      const newUnit = await this.unitRepository.save(createUnitDto)
      return {
        newUnit,
        message: 'Unit created.'
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async findAll() {
    return await this.unitRepository.find({
      relations: {
        unitType: true,
        parentUnit: true
      }
    });
  }

  async findOne(id: string) {
    return await this.unitRepository.findOne({ 
      where: { id },
      relations: {
        unitType: true,
        parentUnit: true
      } 
    })
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    console.log(updateUnitDto);
    const updatedUnitDto = await this.unitRepository.update(id, updateUnitDto)
    return { message: "Update Successful !", updatedUnitDto }
  }

  async remove(id: string) {
    await this.unitRepository.delete(id)

    return { message: "Successfully Deleted !" }
  }
}
