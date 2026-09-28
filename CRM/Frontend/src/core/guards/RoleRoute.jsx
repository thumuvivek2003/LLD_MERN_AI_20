import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { ROLE_HOME } from '../../shared/enums/role.enum.js';

/**
 * There is no auth — this only keeps an actor inside their own console.
 * No picked user → the switcher. Wrong role → that role's home.
 */
export function RoleRoute({ allow = [] }) {
  const { me, userId, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <span className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 size={16} className="animate-spin" /> Loading MetaForce…
        </span>
      </div>
    );
  }

  if (!userId || !me) return <Navigate to="/" replace state={{ from: location.pathname }} />;

  if (allow.length && !allow.includes(me.role)) {
    return <Navigate to={ROLE_HOME[me.role] || '/'} replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
