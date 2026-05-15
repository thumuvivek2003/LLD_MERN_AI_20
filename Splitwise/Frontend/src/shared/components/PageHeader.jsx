import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, subtitle, onBack, right }) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={handleBack}
        className="p-2 rounded-xl bg-white border border-slate-100 shadow-soft hover:bg-brand-50 text-slate-600"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 truncate">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
