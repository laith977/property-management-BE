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
import { sanitizeProperty } from '../common/data';
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
      const saved = await this.propertyRepository.save(property);
      return sanitizeProperty(saved);
    } catch (error) {
      console.error('Create property failed:', error);
      throw new InternalServerErrorException('Failed to create property');
    }
  }

  async findAllByUser(user: User): Promise<Property[]> {
    const properties = await this.propertyRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return properties.map(sanitizeProperty);
  }

  async findOneById(id: number, user: User): Promise<any> {
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

    return {
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
    };
  }

  async update(
    id: number,
    updateDto: UpdatePropertyDto,
    user: User,
  ): Promise<Property> {
    try {
      const property = await this.findOneById(id, user);

      // Merge updateDto with existing entity (preload returns managed entity or undefined)
      const toUpdate = await this.propertyRepository.preload({
        id,
        ...updateDto,
      });

      if (!toUpdate) throw new NotFoundException('Property not found');

      const updated = await this.propertyRepository.save(toUpdate);

      return sanitizeProperty(updated);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Update property failed:', error);
      throw new InternalServerErrorException('Failed to update property');
    }
  }

  async remove(id: number, user: User): Promise<void> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!property) {
        throw new NotFoundException('Property not found');
      }

      if (property.user.id !== user.id) {
        throw new ForbiddenException('You do not have permission');
      }

      await this.propertyRepository.remove(property);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Delete property failed:', error);
      throw new InternalServerErrorException('Failed to delete property');
    }
  }
}
