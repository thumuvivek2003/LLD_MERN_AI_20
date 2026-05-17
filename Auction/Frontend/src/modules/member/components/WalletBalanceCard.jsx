import { Wallet, Plus } from 'lucide-react';
import { formatCurrency } from '../../shared/utils/currency.util.js';

export default function WalletBalanceCard({ balance, onTopUp }) {
  return (
    <div className="card p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-brand-50 p-3 text-brand-600">
          <Wallet size={22} />
        </div>
        <div>
          <p className="text-xs text-slate-500">Wallet balance</p>
          <p className="text-2xl font-semibold text-slate-800">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
      <button onClick={onTopUp} className="btn-primary">
        <Plus size={14} /> Top up
      </button>
    </div>
  );
}
