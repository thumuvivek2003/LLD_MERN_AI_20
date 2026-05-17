import { useAuthStore } from '../../auth/store/auth.store.js';

// Composes role gating around children — useful for showing/hiding bits
// of UI without redirecting (RoleBasedRoute handles redirects).
export default function ProtectedView({ roles, fallback = null, children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return fallback;
  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) {
    return fallback;
  }
  return children;
}
