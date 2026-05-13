import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROLE_HOME } from '../constants/roles.constants.js';

export default function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-brand-light/40">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white text-2xl font-bold shadow-md">R</div>
          <h1 className="mt-3 text-2xl font-bold text-ink">Ride System</h1>
          <p className="text-sm text-slate-500">Book rides in seconds</p>
        </div>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
