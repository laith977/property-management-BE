// src/property/property.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyOwnershipGuard } from './property.guard';

import { Serialize } from '../common/interceptors/serialize.interceptor';
import { PropertyDto } from './dto/property.dto';

@Controller('properties')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @UseGuards(JwtGuard)
  @Serialize(PropertyDto)
  @Get()
  async getMyProperties(@Request() req) {
    return this.propertyService.findAllByUser(req.user);
  }

  @UseGuards(JwtGuard, PropertyOwnershipGuard)
  @Serialize(PropertyDto)
  @Get(':id')
  async getOneProperty(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.propertyService.findOneById(id, req.user);
  }

  @UseGuards(JwtGuard)
  @Serialize(PropertyDto)
  @Post()
  async createProperty(@Body() dto: CreatePropertyDto, @Request() req) {
    return this.propertyService.create(dto, req.user);
  }

  @UseGuards(JwtGuard, PropertyOwnershipGuard)
  @Serialize(PropertyDto)
  @Patch(':id')
  async updateProperty(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyDto,
    @Request() req,
  ) {
    return this.propertyService.update(id, dto, req.user);
  }

  @UseGuards(JwtGuard, PropertyOwnershipGuard)
  @Delete(':id')
  async deleteProperty(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.propertyService.remove(id, req.user);
  }
}
