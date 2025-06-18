import { Property } from 'src/property/property.entity';
import { User } from 'src/user/user.entity';

export function sanitizeProperty(property: Property): Property {
  if (property?.user) {
    const { password, ...safeUser } = property.user;
    return {
      ...property,
      user: safeUser as User,
    };
  }
  return property;
}
