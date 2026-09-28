import { objectColorClass, resolveIcon } from '../../../core/utils/icons.js';
import Badge from '../../../core/components/ui/Badge.jsx';
import cx from '../../../core/utils/cx.js';

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-6 border-b border-slate-100 py-2.5 last:border-0">
    <dt className="text-xs font-medium text-slate-500">{label}</dt>
    <dd className="text-right text-sm font-medium text-slate-800">{value || '—'}</dd>
  </div>
);

/** Final step of the Create Object wizard. */
export function ObjectReviewSummary({ draft }) {
  const Icon = resolveIcon(draft.icon);
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span
          className={cx(
            'flex h-12 w-12 items-center justify-center rounded-xl ring-1',
            objectColorClass(draft.color),
          )}
        >
          <Icon size={22} />
        </span>
        <div>
          <p className="text-base font-bold text-slate-900">{draft.label || 'Untitled object'}</p>
          <p className="font-mono text-xs text-slate-400">{draft.apiName}</p>
        </div>
      </div>

      <dl>
        <Row label="Plural label" value={draft.pluralLabel} />
        <Row label="Description" value={draft.description} />
        <Row label="Accent colour" value={draft.color} />
        <Row
          label="Initial status"
          value={
            draft.publishNow ? <Badge tone="emerald">Published</Badge> : <Badge tone="amber">Draft</Badge>
          }
        />
      </dl>

      <p className="mt-5 rounded-lg bg-accent-soft px-3.5 py-3 text-[11px] leading-relaxed text-accent-ink">
        After creating the object you will be taken to its detail page, where you can add fields,
        configure validation and build search indexes.
      </p>
    </div>
  );
}

export default ObjectReviewSummary;
