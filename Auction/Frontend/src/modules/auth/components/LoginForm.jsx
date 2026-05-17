import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
    } catch {
      /* toast handled globally */
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@auction.com"
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          type="password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
      <p className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-600">
          Register
        </Link>
      </p>
    </form>
  );
}
