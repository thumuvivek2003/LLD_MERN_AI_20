import PinDots from '../components/PinDots.jsx';
import Keypad from '../components/Keypad.jsx';
import { useATM } from '../context/ATMContext.jsx';

export default function EnterPinScreen() {
  const { pin, setPin, submitPin, loading, attemptsLeft } = useATM();

  const onDigit = (d) => {
    if (pin.length >= 4) return;
    setPin(pin + d);
  };
  const onClear = () => setPin('');
  const onEnter = () => {
    if (pin.length === 4) submitPin(pin);
  };

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <h2 className="text-xl font-semibold text-white">Enter your PIN</h2>
      <PinDots value={pin} length={4} />

      <p className="text-xs text-slate-400">Attempts left: {attemptsLeft}/3</p>

      <Keypad onDigit={onDigit} onClear={onClear} onEnter={onEnter} disabled={loading} />

      <button
        type="button"
        disabled={pin.length !== 4 || loading}
        onClick={onEnter}
        className="w-full max-w-xs rounded-xl bg-atmaccent text-slate-900 font-semibold py-2.5 transition-all hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying...' : 'Submit'}
      </button>
    </div>
  );
}
