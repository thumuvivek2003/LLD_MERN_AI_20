import Keypad from '../components/Keypad.jsx';
import { useATM } from '../context/ATMContext.jsx';

export default function EnterAmountScreen() {
  const {
    withdrawAmount,
    setWithdrawAmount,
    previewWithdraw,
    goSelectOperation,
    loading,
    errorMessage
  } = useATM();

  const onDigit = (d) => {
    const next = (withdrawAmount + d).slice(0, 7);
    setWithdrawAmount(next.replace(/^0+(?=\d)/, ''));
  };
  const onClear = () => setWithdrawAmount('');

  const numericAmount = Number(withdrawAmount || 0);
  const validMultiple = numericAmount > 0 && numericAmount % 100 === 0;

  const onConfirm = () => {
    if (!validMultiple) return;
    previewWithdraw(numericAmount);
  };

  const formatINR = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

  return (
    <div className="flex flex-col items-center gap-5 animate-slide-up">
      <h2 className="text-lg font-semibold text-white">Enter amount to withdraw</h2>
      <p className="text-xs text-slate-400">in multiples of ₹100</p>

      <div className="w-full max-w-xs rounded-xl border border-atmborder bg-atmpanel px-4 py-3 text-center">
        <p className="text-3xl font-bold text-atmaccent tabular-nums">
          ₹{formatINR(numericAmount)}
        </p>
      </div>

      <Keypad onDigit={onDigit} onClear={onClear} onEnter={onConfirm} disabled={loading} />

      {!validMultiple && numericAmount > 0 && (
        <p className="text-xs text-red-400">Amount must be a multiple of ₹100</p>
      )}
      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}

      <div className="flex w-full max-w-xs gap-3">
        <button
          type="button"
          onClick={goSelectOperation}
          className="flex-1 rounded-xl border border-atmborder bg-atmpanel text-slate-200 font-medium py-2.5 hover:border-atmaccent/40 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!validMultiple || loading}
          className="flex-1 rounded-xl bg-atmaccent text-slate-900 font-semibold py-2.5 hover:bg-cyan-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
