export default function PinDots({ value = '', length = 4 }) {
  const dots = Array.from({ length }, (_, i) => i < value.length);
  return (
    <div className="flex items-center justify-center gap-4">
      {dots.map((filled, i) => (
        <div
          key={i}
          className={`h-5 w-5 rounded-full border-2 transition-all duration-200 ${
            filled
              ? 'bg-atmaccent border-atmaccent shadow-[0_0_14px_rgba(6,182,212,0.7)]'
              : 'border-slate-600 bg-transparent'
          }`}
        />
      ))}
    </div>
  );
}
