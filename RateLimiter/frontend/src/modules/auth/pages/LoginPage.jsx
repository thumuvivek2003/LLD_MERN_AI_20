import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm.jsx';
import { useLogin } from '../hooks/useAuth.js';
import { useAuthStore } from '../store/auth.store.js';
import { ROUTES } from '../../shared/constants/routes.js';

export function LoginPage() {
  const { submit, loading, error } = useLogin();
  const { token, user } = useAuthStore();

  if (token && user) {
    return (
      <Navigate
        to={user.role === 'admin' ? ROUTES.ADMIN : ROUTES.CLIENT}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-500/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md card p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-9 w-9 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">
            RL
          </span>
          <div>
            <div className="font-semibold text-slate-800">Rate Limiter</div>
            <div className="text-xs text-slate-500">
              Sign in to manage rate limits
            </div>
          </div>
        </div>

        <LoginForm onSubmit={submit} loading={loading} error={error} />

        <div className="mt-6 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <div className="font-medium text-slate-600 mb-1">Demo accounts</div>
          <div>
            Admin: <code>admin</code> / <code>admin123</code>
          </div>
          <div>
            Client: <code>mobile-app</code> / <code>client123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
