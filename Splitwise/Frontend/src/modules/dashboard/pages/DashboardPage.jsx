import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Users, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { api } from '../../../shared/api.js';
import { useApp } from '../../../shared/context/AppContext.jsx';
import Button from '../../../shared/components/Button.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import Avatar from '../../../shared/components/Avatar.jsx';
import GroupCard from '../components/GroupCard.jsx';
import { formatCurrency } from '../../../shared/utils/format.js';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { activeUser, logout, error: errorToast } = useApp();

  const [groups, setGroups] = useState([]);
  const [groupBalances, setGroupBalances] = useState({}); // groupId -> netAmount for active user
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listGroups(activeUser.userId);
      const list = data.groups || [];
      setGroups(list);

      const balPairs = await Promise.all(
        list.map(async (g) => {
          try {
            const bd = await api.getBalances(g.groupId);
            const mine = (bd.balances || []).find((b) => b.userId === activeUser.userId);
            return [g.groupId, mine ? mine.netAmount : 0];
          } catch (_) {
            return [g.groupId, 0];
          }
        })
      );
      setGroupBalances(Object.fromEntries(balPairs));
    } catch (e) {
      errorToast(e.message);
    } finally {
      setLoading(false);
    }
  }, [activeUser, errorToast]);

  useEffect(() => {
    load();
  }, [load]);

  const totalNet = Object.values(groupBalances).reduce((s, v) => s + (Number(v) || 0), 0);
  const youAreOwed = Object.values(groupBalances).reduce(
    (s, v) => s + (v > 0 ? v : 0),
    0
  );
  const youOwe = Object.values(groupBalances).reduce((s, v) => s + (v < 0 ? -v : 0), 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={activeUser?.name} size="lg" />
          <div className="min-w-0">
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-xl font-bold text-slate-800 truncate">{activeUser?.name}</h1>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-soft hover:bg-rose-50 text-slate-500 hover:text-rose-500"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <section className="bg-gradient-to-br from-brand-500 to-teal-500 rounded-3xl p-5 text-white shadow-card mb-6">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm">Overall balance</span>
          <Wallet className="w-5 h-5 text-white/80" />
        </div>
        <div className="mt-2 text-3xl font-bold">
          {totalNet === 0 ? 'All settled' : formatCurrency(totalNet)}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <TrendingUp className="w-3.5 h-3.5" /> You are owed
            </div>
            <div className="text-lg font-semibold mt-1">{formatCurrency(youAreOwed)}</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <TrendingDown className="w-3.5 h-3.5" /> You owe
            </div>
            <div className="text-lg font-semibold mt-1">{formatCurrency(youOwe)}</div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-800">Your groups</h2>
          <Button size="sm" onClick={() => navigate('/groups/new')}>
            <Plus className="w-4 h-4" /> New group
          </Button>
        </div>

        {loading ? (
          <Loader label="Loading groups..." />
        ) : groups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No groups yet"
            description="Create your first group to start splitting expenses."
            action={
              <Button onClick={() => navigate('/groups/new')}>
                <Plus className="w-4 h-4" /> Create group
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groups.map((g) => (
              <GroupCard
                key={g.groupId}
                group={g}
                netAmount={groupBalances[g.groupId] || 0}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
