export default function Loader({ label = 'Loading...', full = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${full ? 'min-h-[60vh]' : 'py-10'}`}>
      <div className="h-10 w-10 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
