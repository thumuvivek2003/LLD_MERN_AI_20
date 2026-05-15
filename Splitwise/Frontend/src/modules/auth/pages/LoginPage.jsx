import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Plus, UserCircle2, Wallet, Users } from 'lucide-react';
import { api } from '../../../shared/api.js';
import { useApp } from '../../../shared/context/AppContext.jsx';
import Button from '../../../shared/components/Button.jsx';
import Input from '../../../shared/components/Input.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import Avatar from '../../../shared/components/Avatar.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error: errorToast, activeUser } = useApp();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('pick'); // 'pick' | 'create'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeUser) navigate('/dashboard', { replace: true });
  }, [activeUser, navigate]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.listUsers();
        if (mounted) setUsers(data.users || []);
      } catch (e) {
        errorToast(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [errorToast]);

  const handlePick = (user) => {
    login(user);
    navigate('/dashboard');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      const data = await api.createUser({ name: name.trim(), email: email.trim() });
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      errorToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-brand-500 text-white shadow-card mb-4">
            <PiggyBank className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Split Expense</h1>
          <p className="text-slate-500 mt-1">Share. Track. Settle.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-6 border border-slate-100">
          <div className="flex bg-brand-50 rounded-2xl p-1 mb-5">
            <button
              type="button"
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                mode === 'pick' ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500'
              }`}
              onClick={() => setMode('pick')}
            >
              Pick user
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                mode === 'create' ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500'
              }`}
              onClick={() => setMode('create')}
            >
              New user
            </button>
          </div>

          {mode === 'pick' ? (
            loading ? (
              <Loader label="Fetching users..." />
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 mb-4">No users yet. Create one to start.</p>
                <Button onClick={() => setMode('create')} size="md">
                  <Plus className="w-4 h-4" /> Create user
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {users.map((u) => (
                  <button
                    key={u.userId}
                    onClick={() => handlePick(u)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
                  >
                    <Avatar name={u.name} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">{u.name}</div>
                      <div className="text-xs text-slate-500 truncate">{u.email}</div>
                    </div>
                    <UserCircle2 className="w-5 h-5 text-brand-400" />
                  </button>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleCreate} className="space-y-3">
              <Input
                label="Name"
                placeholder="Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="aarav@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={submitting} className="w-full" size="lg">
                {submitting ? 'Creating...' : (
                  <>
                    <Wallet className="w-5 h-5" /> Get started
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Simple. Fair. Transparent.
        </p>
      </div>
    </div>
  );
}
