import { useState } from 'react';
import Input from '../../../shared/components/Input.jsx';
import Button from '../../../shared/components/Button.jsx';

export default function LoginForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" required />
      <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
      {error && <p style={{ color: '#e50914', fontSize: 13 }}>{error}</p>}
      <Button type="submit" disabled={loading} fullWidth>{loading ? 'Signing in...' : 'Sign In'}</Button>
    </form>
  );
}
