// src/property/dto/create-property.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  location: string;
}
