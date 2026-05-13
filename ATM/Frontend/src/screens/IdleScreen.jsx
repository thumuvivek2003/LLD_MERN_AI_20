import { CreditCard, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { useATM } from '../context/ATMContext.jsx';

export default function IdleScreen() {
  const { cards, insertCard, loading, errorMessage } = useATM();
  const [pick, setPick] = useState('');

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <h2 className="text-xl sm:text-2xl font-semibold text-white">WELCOME</h2>
      <p className="text-sm text-slate-300">Please insert your card</p>

      {/* Card slot illustration */}
      <div className="relative w-full max-w-xs">
        <div className="mx-auto h-32 w-48 rounded-xl border-2 border-atmaccent/40 bg-atmpanel relative overflow-hidden">
          <div className="absolute inset-x-4 top-3 h-8 rounded-md bg-gradient-to-r from-atmaccent/60 to-cyan-300/40 animate-pulse-slow" />
          <div className="absolute inset-x-4 bottom-4 h-3 rounded bg-atmborder" />
          <CreditCard
            size={28}
            className="absolute top-3 right-3 text-atmaccent/70"
          />
        </div>
        <div className="mt-2 flex justify-center text-atmaccent">
          <ArrowDown className="animate-bounce" size={22} />
        </div>
        <div className="mx-auto mt-1 h-1.5 w-40 rounded-full bg-atmborder" />
      </div>

      <div className="w-full max-w-sm space-y-2 text-left">
        <label className="text-xs uppercase tracking-wider text-slate-400">
          Pick a card (simulated)
        </label>
        <select
          value={pick}
          onChange={(e) => setPick(e.target.value)}
          className="w-full rounded-xl border border-atmborder bg-atmpanel px-3 py-2.5 text-sm text-white focus:outline-none focus:border-atmaccent"
        >
          <option value="">-- Select a card --</option>
          {cards.map((c) => (
            <option key={c.cardNumber} value={c.cardNumber}>
              {c.cardNumber} — {c.bankName || c.bankCode}
            </option>
          ))}
        </select>

        {cards.length === 0 && (
          <p className="text-xs text-amber-300">
            No cards loaded. Is the backend running on the configured API URL?
          </p>
        )}

        <button
          type="button"
          disabled={!pick || loading}
          onClick={() => insertCard(pick)}
          className="w-full rounded-xl bg-atmaccent text-slate-900 font-semibold py-2.5 transition-all hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Inserting...' : 'Insert Card'}
        </button>

        {errorMessage && (
          <p className="text-xs text-red-400 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
