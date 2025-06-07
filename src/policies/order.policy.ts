import { User } from '@prisma/client';

export function getOrdersVisibility(user: User): Record<string, any> {
  if (user.role === 'ADMIN') return {};
  else return { userId: user.id };
}
