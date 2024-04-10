import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/libs/database/entities';
import { Feature } from 'src/libs/database/entities/feature.entity';
import { AddFeatureToRoleDto } from './dto/add-feature-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Feature)
    private readonly featuresRepository: Repository<Feature>
  ) { }
  async create(createRoleDto: CreateRoleDto) {
    try {
      const newRole = await this.rolesRepository.save(createRoleDto)
      return {
        data: newRole,
        message: "Role Created."
      }
    } catch (error) {
      //Check for duplication
      if (error?.code === '23505') {
        throw new ForbiddenException({
          message: "Role is already exists."
        })
      }
      throw error
    }
  }

  async findAll() {
    try {
      const roles = await this.rolesRepository.find({
        relations: {
          features: true
        }
      });
      if (!roles) {
        throw new NotFoundException({
          message: "No Roles Found."
        })
      }
      return roles
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async setRoleFeature(id: string, addFeatureToRoleDto: AddFeatureToRoleDto){

    try {
      const role = await this.rolesRepository.findOne({
        where: {
          id: id
        },
        relations: {
          features: true
        }
      })

      console.log(addFeatureToRoleDto.features);

      const features = await this.featuresRepository.find({ where: {
        id: In(addFeatureToRoleDto.features)
      } })

      role.features = features

      await this.rolesRepository.save(role)

      if(!role){
        throw new NotFoundException({
          message: "Role Not Found."
        })
      }
      return {
        id,
        role,
        features
      }
    } catch (error) {
      console.log(error);
    }

    
  }

  async findOne(id: string) {
    try {
      const role = await this.rolesRepository.findOne({
        where: {
          id
        }
      });
      if (!role) {
        throw new NotFoundException({
          message: "Role Not Found."
        })
      }
      return role
    } catch (error) {
      console.log(error);
      throw error
    }

  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      await this.rolesRepository.update(id, updateRoleDto)
      return {
        message: "Role updated successfully."
      }
    } catch (error) {
      console.log(error);
      if (error?.code === '23505') {
        throw new ForbiddenException({
          message: "Role is already exists."
        })
      }
      throw error
    }
  }

  async remove(id: string) {
    return `${id} role delete`
  }
}
