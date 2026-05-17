const COLORS = [
  'bg-emerald-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-fuchsia-500',
];

function pickColor(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return COLORS[h % COLORS.length];
}

export function Avatar({ name = '?', size = 40, online = false }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  const color = pickColor(name);
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full text-white ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      <span className="font-semibold">{initial}</span>
      {online ? (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white bg-wa-primary" />
      ) : null}
    </div>
  );
}
