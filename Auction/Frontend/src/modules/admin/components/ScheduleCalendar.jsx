import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '../../shared/utils/timer.util.js';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import StatusBadge from './StatusBadge.jsx';

// Renders auctions grouped by date — keeps it list-shaped instead of a real
// calendar widget; matches the screenshot intent without extra libs.
export default function ScheduleCalendar({ auctions = [] }) {
  if (!auctions.length) {
    return (
      <div className="card p-10 text-center text-sm text-slate-500">
        No scheduled auctions.
      </div>
    );
  }

  const groups = auctions.reduce((acc, a) => {
    const day = new Date(a.startTime).toDateString();
    acc[day] = acc[day] ? [...acc[day], a] : [a];
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([day, items]) => (
        <div key={day} className="card p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Calendar size={14} className="text-brand-600" />
            <span className="font-medium text-slate-800">{day}</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {items.map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{a.item?.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {formatDate(a.startTime)} → {formatDate(a.endTime)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    {formatCurrency(a.startPrice)}
                  </span>
                  <StatusBadge status={a.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
