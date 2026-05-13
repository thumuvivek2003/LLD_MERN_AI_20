import Card from '../../../core/components/ui/Card.jsx';

export default function DriverStatusToggle({ status, onChange }) {
  const isOnline = status === 'ONLINE';
  return (
    <Card>
      <div className="text-center py-4">
        <button
          onClick={() => onChange(isOnline ? 'OFFLINE' : 'ONLINE')}
          className={`w-24 h-24 mx-auto rounded-full grid place-items-center text-white text-4xl shadow-lg transition ${
            isOnline ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-300 shadow-slate-200'
          }`}
        >
          ⏻
        </button>
        <p className="mt-4 font-semibold">{isOnline ? 'You are Online' : 'You are Offline'}</p>
        <p className="text-xs text-slate-500 mt-1">Tap to {isOnline ? 'go offline' : 'go online'}</p>
      </div>
    </Card>
  );
}
