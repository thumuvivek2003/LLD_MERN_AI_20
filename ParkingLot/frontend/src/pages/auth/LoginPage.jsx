import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Routes as R } from '../../constants/routes.js';
import { Role } from '../../constants/roles.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { isEmail, required } from '../../utils/validators.js';

const landingFor = (role) =>
  role === Role.ADMIN ? R.ADMIN.DASHBOARD : R.ENTRY.NEW;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const { mutate, isPending, error } = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ token, user }) => {
      setSession({ token, user });
      const from = location.state?.from?.pathname;
      navigate(from || landingFor(user.role), { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!isEmail(form.email)) next.email = 'Enter a valid email';
    if (!required(form.password)) next.password = 'Password is required';
    setErrors(next);
    if (Object.keys(next).length) return;
    mutate(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card title="Sign in to ParkSmart" className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          {error && <div className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{error.error || 'Login failed'}</div>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
