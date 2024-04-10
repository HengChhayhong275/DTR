import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import { DataSource, Repository } from 'typeorm';
import { PasswordReset, User, UserCredential } from 'src/libs/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordDto } from 'src/modules/user/dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const saltOrRounds = 10

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserCredential)
    private readonly userCredentialsRepository: Repository<UserCredential>,
    private readonly dataSource: DataSource,
  ) { }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    try {
      if (changePasswordDto.newPassword !== changePasswordDto.confPassword) {
        throw new BadRequestException({
          message: "New password and Confirm password doesn't matched."
        })
      } else {
        const user = await this.usersRepository.findOne({
          where: {
            id: changePasswordDto.userId
          },
          relations: {
            credential: true
          }
        })

        if (!user) {
          throw new NotFoundException({
            message: "User doesn't exists"
          })
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, saltOrRounds)

        await this.userCredentialsRepository.update(user.credential.id, {
          password: hashedPassword
        })

        await this.usersRepository.update(user.id, {
          rt: ""
        })

        return {
          message: "User password has changed successfully."
        }
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {

      const user = await this.passwordResetRepository.findOne({
        where: {
          token: resetPasswordDto.token
        }, relations: {
          user: true,
        }
      })
      if (!user) {
        throw new ForbiddenException({
          message: "Token is exipred"
        })
      }

      const changePasswordDto = {
        userId: user.user.id,
        newPassword: resetPasswordDto.newPassword,
        confPassword: resetPasswordDto.confPassword
      }

      this.changePassword(changePasswordDto)

      await this.passwordResetRepository.remove(user)

    } catch (error) {
      console.log(error);
      throw error
    }
  }


  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    if (await this.userCredentialsRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })) {
      throw new ForbiddenException({
        message: "Email is already taken"
      })
    }
    else {
      const newUser = await this.usersRepository.save(createUserDto).catch((error) => {
        //Check for duplication
        if (error?.code === '23505') {
          throw new ForbiddenException({
            message: "Phone number is already taken."
          })
        }
      })
      const userCredential = await this.userCredentialsRepository.save({ email: createUserDto.email, password: createUserDto.password })
      await this.usersRepository.update({
        phoneNumber: createUserDto.phoneNumber
      }, {
        credential: userCredential
      })

      return {
        user: newUser,
        message: 'User Created Successfully.'
      }
    }
  }

  async findAll(queryParams: FilterUserDto) {
    let users: User[]
    const { searchText, role, unit, phoneNumber, email } = queryParams
    if (searchText || role || phoneNumber || email || unit) {
      let userCredentialId: string = ''
      if (searchText) {
        const userCredential = await this.userCredentialsRepository.findOne({ where: { email: searchText } })
        if (userCredential) {
          userCredentialId = userCredential.id
        }
      }
      users = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.unit', 'unit')
        .leftJoinAndSelect('user.credential', 'userCredential')
        .where('user.role  = :role', { role })
        .orWhere('user.unit  = :unit', { unit })
        .orWhere('user.firstNameEn like :firstNameEn', { firstNameEn: `%${searchText}%` })
        .orWhere('user.firstNameKh like :firstNameKh', { firstNameKh: `%${searchText}%` })
        .orWhere('user.lastNameEn like :lastNameEn', { lastNameEn: `%${searchText}%` })
        .orWhere('user.lastNameKh like :lastNameKh', { lastNameKh: `%${searchText}%` })
        .orWhere('user.phoneNumber = :phoneNumber', { phoneNumber: `${phoneNumber}` })
        .orWhere('user.credential = :credential', { credential: `${userCredentialId}` })
        .getMany()
    } else {
      users = await this.usersRepository.find({
        relations: {
          credential: true
        },
        order: {
          createdAt: 'ASC'
        }
      })
    }
    if (!users) {
      throw new NotFoundException({
        message: "No users found."
      })
    }
    return users
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id },relations: {
      credential: true
    }, })
    if (!user) {
      throw new NotFoundException({
        message: "No user found."
      })
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //Find if user exists
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        credential: true
      }
    })
    if (!user) {
      throw new NotFoundException({
        message: "No user found."
      })
    }
    const { firstNameEn, lastNameEn, firstNameKh, lastNameKh, address, dob, phoneNumber, role, unit, nationality, gender, email } = updateUserDto
    //Update Email
    await this.userCredentialsRepository.update(user?.credential?.id, {
      email: email
    }).catch((error) => {
      if (error?.code === '23505') {
        throw new ForbiddenException({
          message: "Email is already taken."
        })
      }
      throw error
    })

    //Update user info
    await this.usersRepository.update(id, {
      firstNameEn,
      lastNameEn,
      firstNameKh,
      lastNameKh,
      address,
      dob,
      phoneNumber,
      role,
      unit,
      nationality,
      gender
    }).catch((error) => {
      if (error?.code === '23505') {
        throw new ForbiddenException({
          message: "Phone number is already taken."
        })
      }
      throw error
    })

    return {
      message: "User updated successfully."
    }
  }

  async remove(id: string) {
    const credential = await this.userCredentialsRepository.findOne({
      where: {
        user: {
          id: id
        }
      }
    })
    return await this.userCredentialsRepository.remove(credential)
  }
}