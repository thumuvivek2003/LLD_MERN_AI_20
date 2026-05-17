import { Outlet, Link } from 'react-router-dom';
import { Gavel } from 'lucide-react';
import { ROUTES } from '../modules/shared/constants/routes.constant.js';
import { useAuthStore } from '../modules/auth/store/auth.store.js';
import { useAuth } from '../modules/auth/hooks/useAuth.js';

export default function SpectatorLayout() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to={ROUTES.SPECTATOR_HOME} className="flex items-center gap-2">
            <div className="rounded-md bg-brand-600 p-1.5 text-white">
              <Gavel size={16} />
            </div>
            <span className="font-semibold text-slate-800">Auction · Spectator</span>
          </Link>
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-500">Hi, {user.name}</span>
              <button onClick={logout} className="text-slate-500 hover:text-slate-800">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline">
                Sign in
              </Link>
              <Link to={ROUTES.REGISTER} className="text-slate-500 hover:underline">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
