import DirectionIndicator from '../indicators/DirectionIndicator.jsx';
import { formatRequestRoute, formatEta } from '../../utils/requestFormatter.js';
import { getElevatorColor } from '../../utils/elevatorColor.js';
import clsx from 'clsx';

export default function RequestCard({ request }) {
  const color = request.assignedElevatorId ? getElevatorColor(request.assignedElevatorId) : null;
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800/50 border border-slate-700/50">
      <DirectionIndicator direction={request.direction} size={16} />
      <div className="flex-1">
        <div className="text-sm text-slate-100">{formatRequestRoute(request)}</div>
        <div className="text-[11px] text-slate-400">
          {request.assignedElevatorId ? (
            <span className={clsx('font-semibold', color?.text)}>{request.assignedElevatorId}</span>
          ) : (
            <span>Unassigned</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] uppercase text-slate-500">Estimated</div>
        <div className="text-sm font-semibold text-slate-200">{formatEta(request.etaSeconds)}</div>
      </div>
    </div>
  );
}
