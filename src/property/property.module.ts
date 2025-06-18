// src/property/property.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { PropertyOwnershipGuard } from './property.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyOwnershipGuard],
})
export class PropertyModule {}
