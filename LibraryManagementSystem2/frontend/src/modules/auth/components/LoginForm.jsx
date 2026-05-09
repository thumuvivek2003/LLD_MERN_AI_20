import { useState } from 'react';
import Input from '../../../shared/components/ui/Input.jsx';
import Button from '../../../shared/components/ui/Button.jsx';

export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <Input label="Email" name="email" type="email" value={form.email} onChange={set} />
      <Input label="Password" name="password" type="password" value={form.password} onChange={set} />
      <Button type="submit" disabled={loading}>Login</Button>
    </form>
  );
}
