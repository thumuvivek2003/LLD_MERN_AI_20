import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../core/components/ui/Input.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { useAuth } from '../../../core/hooks/useAuth.js';
import { useAuthForm } from '../hooks/useAuthForm.js';
import { ROLES, ROLE_HOME } from '../../../core/constants/roles.constants.js';

export default function RegisterForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { values, onChange, setValues, error, setError, loading, setLoading } = useAuthForm({
    name: '', email: '', password: '', phone: '', role: ROLES.RIDER,
  });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await signUp(values);
      navigate(ROLE_HOME[user.role] || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h2 className="text-xl font-bold">Create account</h2>
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: ROLES.RIDER, label: 'Rider', icon: '🧍' },
          { v: ROLES.DRIVER, label: 'Driver', icon: '🚖' },
          { v: ROLES.ADMIN, label: 'Admin', icon: '🛡️' },
        ].map((r) => (
          <button
            type="button"
            key={r.v}
            onClick={() => setValues((s) => ({ ...s, role: r.v }))}
            className={`p-3 rounded-xl text-center border ${values.role === r.v ? 'border-brand bg-brand-light/40' : 'border-slate-200'}`}
          >
            <div className="text-xl">{r.icon}</div>
            <div className="text-xs font-semibold mt-1">{r.label}</div>
          </button>
        ))}
      </div>
      <Input label="Full name" name="name" required value={values.name} onChange={onChange} />
      <Input label="Email" name="email" type="email" required value={values.email} onChange={onChange} />
      <Input label="Phone" name="phone" value={values.phone} onChange={onChange} />
      <Input label="Password" name="password" type="password" required value={values.password} onChange={onChange} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Register'}</Button>
      <p className="text-center text-sm text-slate-500">
        Have an account? <Link to="/login" className="text-brand font-semibold">Login</Link>
      </p>
    </form>
  );
}
