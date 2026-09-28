import cx from '../../utils/cx.js';
import { DOTS, TONES } from './Badge.jsx';
import {
  INDEX_STATUS_LABEL,
  INDEX_STATUS_TONE,
  JOB_STATUS_LABEL,
  JOB_STATUS_TONE,
  OBJECT_STATUS_LABEL,
  OBJECT_STATUS_TONE,
  RECORD_STATUS_LABEL,
  RECORD_STATUS_TONE,
} from '../../../shared/enums/index.js';

/**
 * One pill for every status enum in the contract.
 * `kind` selects the label + tone lookup so callers never map colours themselves.
 */
const REGISTRY = {
  object: { label: OBJECT_STATUS_LABEL, tone: OBJECT_STATUS_TONE },
  record: { label: RECORD_STATUS_LABEL, tone: RECORD_STATUS_TONE },
  index: { label: INDEX_STATUS_LABEL, tone: INDEX_STATUS_TONE },
  job: { label: JOB_STATUS_LABEL, tone: JOB_STATUS_TONE },
};

const HEALTH_TONE = { Healthy: 'emerald', Degraded: 'amber', Down: 'rose', Connected: 'emerald' };

export function StatusPill({ kind = 'object', status, dot = true, className }) {
  if (!status) return <span className="text-slate-300">—</span>;
  const map = REGISTRY[kind];
  const tone = map?.tone[status] || HEALTH_TONE[status] || 'slate';
  const label = map?.label[status] || status;
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', DOTS[tone])} />}
      {label}
    </span>
  );
}

export default StatusPill;
