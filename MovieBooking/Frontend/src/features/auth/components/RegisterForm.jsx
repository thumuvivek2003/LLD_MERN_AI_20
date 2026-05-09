import { useState } from 'react';
import Input from '../../../shared/components/Input.jsx';
import Button from '../../../shared/components/Button.jsx';

export default function RegisterForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Full Name" value={form.name} onChange={set('name')} placeholder="John Doe" required />
      <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" required />
      <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="min 6 characters" required />
      {error && <p style={{ color: '#e50914', fontSize: 13 }}>{error}</p>}
      <Button type="submit" disabled={loading} fullWidth>{loading ? 'Creating...' : 'Create Account'}</Button>
    </form>
  );
}
