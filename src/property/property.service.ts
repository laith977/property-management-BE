import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from '../user/user.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    user: User,
  ): Promise<Property> {
    try {
      const property = this.propertyRepository.create({
        ...createPropertyDto,
        user,
      });
      return await this.propertyRepository.save(property);
    } catch (error) {
      console.error('Create property failed:', error);
      throw new InternalServerErrorException('Failed to create property');
    }
  }

  async findAllByUser(user: User): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: number, user: User): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.user.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to access this property',
      );
    }

    return property;
  }

  async update(
    id: number,
    updateDto: UpdatePropertyDto,
    user: User,
  ): Promise<Property> {
    try {
      const property = await this.findOneById(id, user);
      Object.assign(property, updateDto);
      return await this.propertyRepository.save(property);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Update property failed:', error);
      throw new InternalServerErrorException('Failed to update property');
    }
  }

  async remove(id: number, user: User): Promise<void> {
    try {
      const property = await this.findOneById(id, user);
      await this.propertyRepository.remove(property);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Delete property failed:', error);
      throw new InternalServerErrorException('Failed to delete property');
    }
  }
}
