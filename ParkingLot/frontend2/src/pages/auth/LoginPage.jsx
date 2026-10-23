import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../features/auth/components/LoginForm.jsx';
import { Routes } from '../../constants/routes.js';
import { Roles } from '../../constants/roles.js';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname;

  const onSuccess = ({ user }) => {
    if (fromPath) return navigate(fromPath, { replace: true });
    if (user?.role === Roles.ADMIN) return navigate(Routes.ADMIN_DASHBOARD, { replace: true });
    return navigate(Routes.ENTRY_NEW, { replace: true });
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold">
            P
          </div>
          <div>
            <p className="font-semibold">PARKING LOT</p>
            <p className="text-xs text-white/70">MANAGEMENT SYSTEM</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            Smart parking,<br />simply managed.
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/70">
            Allocate slots, generate tickets and process exits — all from one clean dashboard.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Slots', value: '1,248' },
            { label: 'Today', value: '₹84k' },
            { label: 'Lots', value: '06' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur">
              <p className="text-lg font-semibold">{s.value}</p>
              <p className="text-xs text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-ink-900">Sign in</h2>
            <p className="mt-1 text-sm text-ink-500">
              Use your work email to access the system.
            </p>
          </div>
          <LoginForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
