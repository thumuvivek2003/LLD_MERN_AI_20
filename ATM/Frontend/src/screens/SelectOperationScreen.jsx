import { Wallet, BadgeIndianRupee, LogOut, ChevronRight } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function SelectOperationScreen() {
  const { checkBalance, startWithdraw, exitSession } = useATM();

  const Item = ({ icon: Icon, label, onClick, tone = 'accent' }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 rounded-xl border border-atmborder bg-atmpanel hover:bg-atmborder px-4 py-3.5 transition-all active:scale-[0.99]"
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            tone === 'accent'
              ? 'bg-atmaccent/15 text-atmaccent'
              : tone === 'success'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-red-500/15 text-red-400'
          }`}
        >
          <Icon size={18} />
        </span>
        <span className="text-sm font-medium text-white">{label}</span>
      </span>
      <ChevronRight size={18} className="text-slate-500" />
    </button>
  );

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      <h2 className="text-lg font-semibold text-white text-center">
        Please select an option
      </h2>
      <div className="flex flex-col gap-3 max-w-sm w-full mx-auto">
        <Item icon={Wallet} label="Check Balance" onClick={checkBalance} />
        <Item
          icon={BadgeIndianRupee}
          label="Withdraw Cash"
          onClick={startWithdraw}
          tone="success"
        />
        <Item icon={LogOut} label="Exit" onClick={exitSession} tone="danger" />
      </div>
    </div>
  );
}
