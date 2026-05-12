import { useState } from 'react';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { validateEmail } from '../../../core/utils/validation.util.js';

export const LoginForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!validateEmail(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password required';
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <form onSubmit={submit}>
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="you@example.com" />
      <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} placeholder="••••••••" />
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
};
