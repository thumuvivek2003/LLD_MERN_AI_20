export default function Loader({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-slate-500">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-brand rounded-full animate-spin" />
      {label && <p className="text-sm mt-2">{label}</p>}
    </div>
  );
}
