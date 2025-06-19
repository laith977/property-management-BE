import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    try {
      const existingUser = await this.repo.findOne({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }

      const user = this.repo.create(dto);
      return await this.repo.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('User creation failed:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.repo.remove(user);
  }
}
