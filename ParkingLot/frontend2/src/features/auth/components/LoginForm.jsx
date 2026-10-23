import { useState } from 'react';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { isEmail, required } from '../../../utils/validators.js';
import { useLogin } from '../hooks/useLogin.js';

export function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const login = useLogin();

  const validate = () => {
    const next = {};
    if (!isEmail(form.email)) next.email = 'Enter a valid email';
    if (!required(form.password)) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login.mutate(form, {
      onSuccess: (data) => onSuccess?.(data),
    });
  };

  const setField = (name) => (e) =>
    setForm((prev) => ({ ...prev, [name]: e.target.value }));

  const apiError = login.error?.response?.data?.message || login.error?.message;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={setField('email')}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={setField('password')}
        error={errors.password}
        autoComplete="current-password"
      />

      {apiError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {apiError}
        </div>
      )}

      <Button type="submit" fullWidth size="lg" disabled={login.isPending}>
        {login.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
