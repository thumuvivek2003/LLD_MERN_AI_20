import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../core/components/ui/Input.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { useAuth } from '../../../core/hooks/useAuth.js';
import { useAuthForm } from '../hooks/useAuthForm.js';
import { ROLE_HOME } from '../../../core/constants/roles.constants.js';

export default function LoginForm() {
  const { signIn } = useAuth();
  const { values, onChange, error, setError, loading, setLoading } = useAuthForm({ email: '', password: 'password123' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await signIn(values);
      navigate(ROLE_HOME[user.role] || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h2 className="text-xl font-bold">Welcome back</h2>
      <p className="text-sm text-slate-500 -mt-2">Sign in to continue</p>
      <Input label="Email" name="email" type="email" required value={values.email} onChange={onChange} />
      <Input label="Password" name="password" type="password" required value={values.password} onChange={onChange} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in...' : 'Login'}</Button>
      <p className="text-center text-sm text-slate-500">
        New here? <Link to="/register" className="text-brand font-semibold">Create account</Link>
      </p>
    </form>
  );
}
