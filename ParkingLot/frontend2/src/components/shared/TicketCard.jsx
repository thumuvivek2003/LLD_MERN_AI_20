import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatDate } from '../../utils/formatDate.js';

export function TicketCard({ ticket }) {
  if (!ticket) return null;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-500">Ticket ID</p>
          <p className="font-mono text-lg font-semibold text-ink-900">
            {ticket.ticketId || ticket.id}
          </p>
        </div>
        <Badge tone="brand">{ticket.status || 'ACTIVE'}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-ink-500">Vehicle</p>
          <p className="font-mono font-medium text-ink-800">
            {ticket.vehicle?.numberPlate || ticket.plate || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-500">Slot</p>
          <p className="font-mono font-medium text-ink-800">
            {ticket.slot?.code || ticket.slotCode || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-500">Entry Time</p>
          <p className="text-ink-800">{formatDate(ticket.entryTime)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-500">Lot</p>
          <p className="text-ink-800">{ticket.lot?.name || ticket.lotName || '—'}</p>
        </div>
      </div>
    </Card>
  );
}
