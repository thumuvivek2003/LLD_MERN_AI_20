import { useEffect, useState } from 'react';
import WalletBalanceCard from '../components/WalletBalanceCard.jsx';
import TopUpWalletModal from '../components/TopUpWalletModal.jsx';
import { walletApi } from '../services/wallet.api.js';
import { useAuthStore } from '../../auth/store/auth.store.js';
import Loader from '../../shared/components/Loader.jsx';

export default function WalletPage() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    walletApi
      .getBalance()
      .then((d) => setBalance(d.balance))
      .finally(() => setLoading(false));
  }, []);

  function handleSuccess(newBalance) {
    setBalance(newBalance);
    updateUser({ walletBalance: newBalance });
  }

  if (loading) return <Loader full />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Wallet</h1>
        <p className="text-sm text-slate-500">
          Funds are reserved at bid time and debited when you win.
        </p>
      </div>
      <WalletBalanceCard balance={balance} onTopUp={() => setOpen(true)} />
      <div className="card p-5 text-sm text-slate-600">
        <p className="font-medium text-slate-800 mb-1">How it works</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your wallet balance must be at least your bid amount.</li>
          <li>No money leaves your wallet until the auction closes in your favour.</li>
          <li>Top-ups apply instantly to active auctions.</li>
        </ul>
      </div>
      <TopUpWalletModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
