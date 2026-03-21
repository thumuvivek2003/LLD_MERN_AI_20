import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permission';

export function usePermission(permission: string): boolean {
  const user = useAuthStore((s) => s.user);
  return hasPermission(user, permission);
}
