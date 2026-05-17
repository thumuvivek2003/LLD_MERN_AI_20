import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../../shared/components/Button.jsx';
import Input from '../../../shared/components/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function RegisterForm() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await register({ ...form, role: 'customer' });
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch {
      // shown inline
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Your name"
      />
      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        type="password"
        required
        minLength={4}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="At least 4 characters"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
      <p className="text-sm text-slate-500 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-brand font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
