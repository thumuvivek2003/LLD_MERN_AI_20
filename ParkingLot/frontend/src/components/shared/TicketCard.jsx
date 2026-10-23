import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatDate } from '../../utils/formatDate.js';

export const TicketCard = ({ ticket }) => {
  if (!ticket) return null;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-slate-500">Ticket</div>
          <div className="text-lg font-mono font-semibold text-slate-900">{ticket.ticketNumber}</div>
        </div>
        <Badge tone={ticket.status === 'ACTIVE' ? 'success' : 'default'}>{ticket.status}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Vehicle</dt>
          <dd className="font-medium text-slate-800">{ticket.vehicle?.licensePlate}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Type</dt>
          <dd className="font-medium text-slate-800">{ticket.vehicle?.type}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Entry</dt>
          <dd className="font-medium text-slate-800">{formatDate(ticket.entryTime)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Exit</dt>
          <dd className="font-medium text-slate-800">{formatDate(ticket.exitTime)}</dd>
        </div>
      </dl>
    </Card>
  );
};
