// modules/status/components/StatusCard.jsx — full-screen rendering of a single
// text status on its gradient background (used inside the viewer).
import { statusBgClass } from '../../../core/utils/color.util.js';

export function StatusCard({ status }) {
  return (
    <div className={`absolute inset-0 grid place-items-center px-8 ${statusBgClass(status.background)}`}>
      <p className="text-white text-3xl font-semibold text-center leading-snug break-words">
        {status.text}
      </p>
    </div>
  );
}
