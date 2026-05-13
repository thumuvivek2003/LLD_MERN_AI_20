import { Delete, CornerDownLeft } from 'lucide-react';

/**
 * Numeric keypad.
 *  - onDigit(digit)
 *  - onClear() — clear all
 *  - onEnter()
 *  - clearLabel / enterLabel optional
 *  - disabled
 */
export default function Keypad({
  onDigit,
  onClear,
  onEnter,
  disabled = false,
  clearLabel = 'Clear',
  enterLabel = 'Enter'
}) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const baseBtn =
    'h-14 sm:h-16 rounded-xl border border-atmborder bg-atmpanel text-white font-semibold text-lg sm:text-xl select-none transition-all hover:bg-atmborder hover:border-atmaccent/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-xs mx-auto">
      {digits.map((d) => (
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={() => onDigit?.(d)}
          className={baseBtn}
        >
          {d}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onClear?.()}
        className="h-14 sm:h-16 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 font-semibold transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-40 inline-flex items-center justify-center gap-2"
      >
        <Delete size={18} />
        <span className="hidden sm:inline">{clearLabel}</span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit?.('0')}
        className={baseBtn}
      >
        0
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onEnter?.()}
        className="h-14 sm:h-16 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-40 inline-flex items-center justify-center gap-2"
      >
        <CornerDownLeft size={18} />
        <span className="hidden sm:inline">{enterLabel}</span>
      </button>
    </div>
  );
}
