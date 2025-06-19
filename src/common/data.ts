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
// cookie.helper.ts
import { Response } from 'express';

export function setAuthCookie(res: Response, token: string) {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
export function clearAuthCookie(res: Response) {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
