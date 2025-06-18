import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PropertyService } from './property.service';

@Injectable()
export class PropertyOwnershipGuard implements CanActivate {
  constructor(private propertyService: PropertyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const propertyId = parseInt(request.params.id);

    if (!propertyId) {
      return true;
    }

    try {
      await this.propertyService.findOneById(propertyId, user);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Property not found');
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'You do not have permission to access this property',
        );
      }
      throw error;
    }
  }
}
