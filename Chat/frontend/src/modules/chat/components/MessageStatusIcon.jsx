import { MESSAGE_STATUS } from '../../../shared/constants/socket.constant.js';

/**
 * WhatsApp-style status ticks.
 *  - SENT      : single check (gray)
 *  - DELIVERED : double check (gray)
 *  - READ      : double check (blue)
 */
export function MessageStatusIcon({ status, className = '' }) {
  if (!status) return null;
  if (status === MESSAGE_STATUS.SENT) {
    return (
      <svg
        viewBox="0 0 16 16"
        className={`h-3.5 w-3.5 text-wa-muted ${className}`}
        fill="currentColor"
      >
        <path d="M11.071 3.479a.5.5 0 0 1 .15.692l-5 7a.5.5 0 0 1-.78.064l-3-3.5a.5.5 0 1 1 .76-.65l2.59 3.022 4.588-6.428a.5.5 0 0 1 .692-.2z" />
      </svg>
    );
  }
  const color =
    status === MESSAGE_STATUS.READ ? 'text-wa-read' : 'text-wa-muted';
  return (
    <svg
      viewBox="0 0 18 16"
      className={`h-3.5 w-4 ${color} ${className}`}
      fill="currentColor"
    >
      <path d="M9.07 3.48a.5.5 0 0 1 .15.69l-5 7a.5.5 0 0 1-.78.06l-3-3.5a.5.5 0 1 1 .76-.65l2.59 3.02L8.38 3.68a.5.5 0 0 1 .69-.2z" />
      <path d="M14.07 3.48a.5.5 0 0 1 .15.69l-5 7a.5.5 0 0 1-.78.06l-1.05-1.23.66-.92.78.91L13.38 3.68a.5.5 0 0 1 .69-.2z" />
    </svg>
  );
}
