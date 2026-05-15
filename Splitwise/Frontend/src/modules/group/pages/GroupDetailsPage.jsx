import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  HandCoins,
  UserPlus,
  Pencil,
  Check,
  X,
  Receipt,
  Wallet,
  Users,
  Scale,
  LogOut
} from 'lucide-react';
import { api } from '../../../shared/api.js';
import { useApp } from '../../../shared/context/AppContext.jsx';
import Button from '../../../shared/components/Button.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import AddMemberModal from '../components/AddMemberModal.jsx';
import MemberList from '../components/MemberList.jsx';
import ExpenseList from '../../expense/components/ExpenseList.jsx';
import BalanceList from '../../balance/components/BalanceList.jsx';
import SimplifiedDebtList from '../../balance/components/SimplifiedDebtList.jsx';
import SettlementList from '../../settlement/components/SettlementList.jsx';
import { formatCurrency } from '../../../shared/utils/format.js';

const TABS = [
  { key: 'expenses', label: 'Expenses', icon: Receipt },
  { key: 'balances', label: 'Balances', icon: Scale },
  { key: 'settlements', label: 'History', icon: HandCoins },
  { key: 'members', label: 'Members', icon: Users }
];

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { activeUser, success, error: errorToast, info } = useApp();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [debts, setDebts] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('expenses');
  const [showAddMember, setShowAddMember] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  const activeMembers = useMemo(
    () => (group?.members || []).filter((m) => m.status === 'ACTIVE'),
    [group]
  );
  const memberIds = useMemo(() => (group?.members || []).map((m) => m.userId), [group]);

  const isMember = useMemo(
    () => activeMembers.some((m) => m.userId === activeUser?.userId),
    [activeMembers, activeUser]
  );

  const yourBalance = useMemo(() => {
    const b = balances.find((x) => x.userId === activeUser?.userId);
    return b ? b.netAmount : 0;
  }, [balances, activeUser]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [g, exp, bal, dbt, set] = await Promise.all([
        api.getGroup(groupId),
        api.listExpenses(groupId),
        api.getBalances(groupId).catch(() => ({ balances: [] })),
        api.getSimplifiedDebts(groupId).catch(() => ({ debts: [] })),
        api.listSettlements(groupId).catch(() => ({ settlements: [] }))
      ]);
      setGroup(g.group);
      setNameDraft(g.group.name);
      setExpenses(exp.expenses || []);
      setBalances(bal.balances || []);
      setDebts(dbt.debts || []);
      setSettlements(set.settlements || []);
    } catch (e) {
      errorToast(e.message);
    } finally {
      setLoading(false);
    }
  }, [groupId, errorToast]);

  useEffect(() => {
    load();
  }, [load]);

  const saveName = async () => {
    const next = nameDraft.trim();
    if (!next || next === group.name) {
      setEditingName(false);
      setNameDraft(group.name);
      return;
    }
    try {
      const data = await api.updateGroup(groupId, { name: next });
      setGroup(data.group);
      success('Group renamed');
      setEditingName(false);
    } catch (e) {
      errorToast(e.message);
    }
  };

  const handleAddMember = async (user) => {
    try {
      const data = await api.addMember(groupId, user.userId);
      setGroup(data.group);
      success(`${user.name} added`);
    } catch (e) {
      errorToast(e.message);
    }
  };

  const handleRemoveMember = async (member) => {
    try {
      const data = await api.removeMember(groupId, member.userId);
      setGroup(data.group);
      info(`${member.name} removed`);
      await load();
    } catch (e) {
      errorToast(e.message);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Leave this group?')) return;
    try {
      await api.leaveGroup(groupId, activeUser.userId);
      success('You left the group');
      navigate('/dashboard');
    } catch (e) {
      errorToast(e.message);
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (!confirm(`Delete "${expense.description}"?`)) return;
    try {
      await api.deleteExpense(expense.expenseId);
      success('Expense deleted');
      await load();
    } catch (e) {
      errorToast(e.message);
    }
  };

  const canManageMembers = isMember;
  const isCreator =
    (group?.members || []).find((m) => m.userId === activeUser?.userId)?.role === 'CREATOR';

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
        <Loader />
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto">
      <PageHeader
        title={
          editingName ? (
            <span className="flex items-center gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="bg-white border border-brand-300 rounded-lg px-2 py-1 text-base outline-none focus:ring-2 focus:ring-brand-100"
                autoFocus
              />
              <button
                onClick={saveName}
                className="p-1.5 rounded-lg bg-brand-500 text-white"
                aria-label="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditingName(false);
                  setNameDraft(group.name);
                }}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>{group.name}</span>
              {isCreator && (
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                  aria-label="Rename"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </span>
          )
        }
        subtitle={group.description}
        onBack={() => navigate('/dashboard')}
      />

      <section
        className={`rounded-3xl p-5 text-white shadow-card mb-5 ${
          yourBalance > 0
            ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
            : yourBalance < 0
            ? 'bg-gradient-to-br from-rose-500 to-pink-500'
            : 'bg-gradient-to-br from-slate-500 to-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm">
            {yourBalance > 0
              ? 'You are owed'
              : yourBalance < 0
              ? 'You owe'
              : 'You are all settled'}
          </span>
          <Wallet className="w-5 h-5 text-white/80" />
        </div>
        <div className="mt-2 text-3xl font-bold">
          {formatCurrency(Math.abs(yourBalance))}
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            className="!bg-white !text-brand-700 !border-white"
            onClick={() => navigate(`/groups/${groupId}/expenses/new`)}
          >
            <Plus className="w-4 h-4" /> Add expense
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="!bg-white/15 !text-white !border-white/20"
            onClick={() => navigate(`/groups/${groupId}/settle`)}
          >
            <HandCoins className="w-4 h-4" /> Settle up
          </Button>
        </div>
      </section>

      <div className="flex bg-white rounded-2xl border border-slate-100 shadow-soft p-1 mb-5 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 min-w-[88px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                active ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-brand-600'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'expenses' && (
        <section>
          {expenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No expenses yet"
              description="Add your first expense to start tracking."
              action={
                <Button onClick={() => navigate(`/groups/${groupId}/expenses/new`)}>
                  <Plus className="w-4 h-4" /> Add expense
                </Button>
              }
            />
          ) : (
            <ExpenseList
              expenses={expenses}
              members={group.members}
              activeUserId={activeUser?.userId}
              onEdit={(e) => navigate(`/groups/${groupId}/expenses/${e.expenseId}/edit`)}
              onDelete={handleDeleteExpense}
            />
          )}
        </section>
      )}

      {tab === 'balances' && (
        <section className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Net balances</h3>
            {balances.length === 0 ? (
              <EmptyState icon={Scale} title="No balances" description="Add expenses to see balances." />
            ) : (
              <BalanceList balances={balances} activeUserId={activeUser?.userId} />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Simplified debts</h3>
            {debts.length === 0 ? (
              <p className="text-sm text-slate-500 px-1">All settled — nothing to pay.</p>
            ) : (
              <SimplifiedDebtList debts={debts} />
            )}
          </div>
        </section>
      )}

      {tab === 'settlements' && (
        <section>
          {settlements.length === 0 ? (
            <EmptyState
              icon={HandCoins}
              title="No settlements yet"
              description="When someone pays back, it'll show here."
              action={
                <Button onClick={() => navigate(`/groups/${groupId}/settle`)}>
                  <HandCoins className="w-4 h-4" /> Settle up
                </Button>
              }
            />
          ) : (
            <SettlementList settlements={settlements} members={group.members} />
          )}
        </section>
      )}

      {tab === 'members' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">
              {activeMembers.length} active member{activeMembers.length === 1 ? '' : 's'}
            </h3>
            {canManageMembers && (
              <Button size="sm" onClick={() => setShowAddMember(true)}>
                <UserPlus className="w-4 h-4" /> Add
              </Button>
            )}
          </div>
          <MemberList
            members={group.members}
            activeUserId={activeUser?.userId}
            canManage={isCreator}
            onRemove={handleRemoveMember}
          />
          {isMember && (
            <button
              onClick={handleLeave}
              className="flex items-center gap-2 text-sm text-rose-500 font-semibold mt-2 px-2 py-1.5 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" /> Leave group
            </button>
          )}
        </section>
      )}

      <AddMemberModal
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        existingMemberIds={memberIds}
        onAdd={async (u) => {
          await handleAddMember(u);
          setShowAddMember(false);
        }}
      />
    </div>
  );
}
