import { BriefcaseBusiness, Play } from 'lucide-react';
import { JOB_STATUS } from '../../../shared/enums/job-status.enum.js';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import ProgressBar from '../../../core/components/charts/ProgressBar.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatTime } from '../../../core/utils/formatters.js';

const TONE = {
  [JOB_STATUS.RUNNING]: 'sky',
  [JOB_STATUS.COMPLETED]: 'emerald',
  [JOB_STATUS.QUEUED]: 'amber',
  [JOB_STATUS.FAILED]: 'rose',
};

/** Background jobs with progress bars — dashboard panel and Background Jobs page. */
export function JobList({ jobs = [], loading, error, onRetry, onRun, busyId }) {
  if (loading) return <SkeletonText lines={7} className="p-5" />;
  if (error) return <ErrorState error={error} onRetry={onRetry} compact />;
  if (!jobs.length) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="No jobs scheduled"
        description="Index builds and maintenance jobs will appear here."
        compact
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-50">
      {jobs.map((job) => (
        <li key={job.jobId} className="px-5 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
              <BriefcaseBusiness size={15} />
            </span>
            {/* A floor on the name keeps it readable inside the narrow dashboard
                panel — without it the fixed-width progress/status items crush
                this column to a single character before anything wraps. */}
            <div className="min-w-[9rem] flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{job.name}</p>
              {job.detail && <p className="truncate text-[11px] text-slate-400">{job.detail}</p>}
            </div>
            <div className="hidden w-40 sm:block">
              <ProgressBar value={job.progress ?? 0} size="sm" tone={TONE[job.status] || 'sky'} />
            </div>
            <span className="w-10 shrink-0 text-right text-[11px] font-semibold text-slate-500">
              {job.progress ?? 0}%
            </span>
            <StatusPill kind="job" status={job.status} />
            <span className="shrink-0 text-[11px] text-slate-400">
              {formatTime(job.finishedAt || job.startedAt)}
            </span>
            {onRun && (
              <button
                type="button"
                aria-label={`Run ${job.name}`}
                disabled={busyId === job.jobId}
                onClick={() => onRun(job)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-accent-soft hover:text-accent disabled:opacity-40"
              >
                <Play size={14} />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default JobList;
