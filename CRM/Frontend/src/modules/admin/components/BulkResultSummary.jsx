import { CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../../core/components/ui/Button.jsx';

/** Result of `POST /records/bulk` or `/records/import` — shared by both wizards. */
export function BulkResultSummary({ result, onDone, doneLabel = 'Done' }) {
  const failed = result?.failed ?? 0;

  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3.5">
        <CheckCircle2 size={22} className="shrink-0 text-emerald-500" />
        <div>
          <p className="text-sm font-bold text-emerald-900">Operation complete</p>
          <p className="text-xs text-emerald-700">
            {result?.processed ?? 0} processed · {result?.succeeded ?? 0} succeeded · {failed} failed
          </p>
        </div>
      </div>

      {failed > 0 && result?.errors?.length > 0 && (
        <div className="mt-4 rounded-xl border border-rose-200">
          <p className="border-b border-rose-100 bg-rose-50/60 px-4 py-2.5 text-xs font-semibold text-rose-700">
            {result.errors.length} record{result.errors.length === 1 ? '' : 's'} failed
          </p>
          <ul className="max-h-56 divide-y divide-slate-50 overflow-y-auto">
            {result.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2 px-4 py-2.5">
                <XCircle size={14} className="mt-0.5 shrink-0 text-rose-400" />
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px] text-slate-500">
                    {error.recordId || `Row ${index + 1}`}
                  </p>
                  <p className="text-xs text-slate-700">{error.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onDone && (
        <div className="mt-5 flex justify-end">
          <Button onClick={onDone}>{doneLabel}</Button>
        </div>
      )}
    </div>
  );
}

export default BulkResultSummary;
