import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROLES } from '../../shared/constants/roles.constant.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.MEMBER,
  });
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
    } catch {
      /* toast handled globally */
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Full name</label>
        <input
          required
          className="input"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          required
          className="input"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="input"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
        />
      </div>
      <div>
        <label className="label">Role</label>
        <select
          className="input"
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
        >
          <option value={ROLES.MEMBER}>Member (bidder)</option>
          <option value={ROLES.SPECTATOR}>Spectator</option>
        </select>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Create account
      </Button>
      <p className="text-center text-xs text-slate-500">
        Already a user?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}
