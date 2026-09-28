import { LOG_LEVEL_LIST, LOG_LEVEL_RING } from '../../../shared/enums/log-level.enum.js';
import { DonutChart } from '../../../core/components/charts/index.js';
import { Skeleton } from '../../../core/components/ui/Skeleton.jsx';

/** Four ring counters — INFO / WARNING / ERROR / CRITICAL (`GET /system/logs/summary`). */
export function LogLevelDonuts({ summary, loading }) {
  const total = LOG_LEVEL_LIST.reduce((sum, level) => sum + (summary?.[level] ?? 0), 0) || 1;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {LOG_LEVEL_LIST.map((level) => {
        const count = summary?.[level] ?? 0;
        return (
          <div key={level} className="flex flex-col items-center">
            {loading ? (
              <Skeleton className="h-[92px] w-[92px] rounded-full" />
            ) : (
              <div className="w-[92px]">
                <DonutChart
                  height={92}
                  innerRadius="76%"
                  outerRadius="94%"
                  showTooltip={false}
                  centerValue={<span className="text-lg">{count}</span>}
                  data={[
                    { label: level, value: count, color: LOG_LEVEL_RING[level] },
                    { label: 'other', value: Math.max(0, total - count), color: '#F1F5F9' },
                  ]}
                />
              </div>
            )}
            <p className="mt-1 text-[11px] font-semibold text-slate-600">
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default LogLevelDonuts;
