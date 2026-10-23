import { User } from './types';

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions?.includes(permission) ?? false;
}
