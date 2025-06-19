// src/property/dto/property.dto.ts
import { Expose } from 'class-transformer';

export class PropertyDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  price: number;
  @Expose()
  location: string;
}
