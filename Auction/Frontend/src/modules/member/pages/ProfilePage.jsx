import { User, Mail, Shield, Wallet } from 'lucide-react';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { formatCurrency } from '../../shared/utils/currency.util.js';

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
      <div className="rounded-md bg-slate-100 p-2 text-slate-500">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <Row icon={User} label="Name" value={user?.name} />
          <Row icon={Mail} label="Email" value={user?.email} />
          <Row icon={Shield} label="Role" value={user?.role} />
          <Row icon={Wallet} label="Wallet" value={formatCurrency(user?.walletBalance || 0)} />
        </div>
      </div>
    </div>
  );
}
