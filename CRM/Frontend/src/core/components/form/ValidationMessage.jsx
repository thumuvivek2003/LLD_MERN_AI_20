import { AlertCircle } from 'lucide-react';

export function ValidationMessage({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-[11px] font-medium text-rose-600">
      <AlertCircle size={12} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

export function HelpText({ text }) {
  if (!text) return null;
  return <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{text}</p>;
}

export default ValidationMessage;
