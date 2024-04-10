import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Injectable()
export class FeatureService {
  create(createFeatureDto: CreateFeatureDto) {
    return 'This action adds a new feature';
  }

  findAll() {
    return `This action returns all features`;
  }

  findOne(id: string) {
    return `This action returns a #${id} feature`;
  }

  update(id: string, updateFeatureDto: UpdateFeatureDto) {
    return `This action updates a #${id} feature`;
  }

  remove(id: string) {
    return `This action removes a #${id} feature`;
  }
}
