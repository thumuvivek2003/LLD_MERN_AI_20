import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Routes } from '../../constants/routes.js';
import { formatDate } from '../../utils/formatDate.js';

export function TicketGeneratedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;

  useEffect(() => {
    if (!ticket) navigate(Routes.ENTRY_NEW, { replace: true });
  }, [ticket, navigate]);

  if (!ticket) return null;

  const ticketNumber = ticket.ticketNumber || ticket.number || ticket._id;
  const slotCode = ticket.slot?.code || ticket.slotCode || ticket.slotNumber || '—';
  const plate = ticket.vehicle?.licensePlate || ticket.licensePlate || '—';

  return (
    <PageContainer title="Ticket Generated" subtitle="Hand the ticket to the driver">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
              ✓
            </div>
            <h3 className="mt-3 text-lg font-semibold text-ink-900">Slot Allocated</h3>
            <p className="mt-1 text-sm text-ink-500">Entry recorded at</p>
            <p className="text-sm font-medium text-ink-700">
              {formatDate(ticket.entryTime)}
            </p>

            <div className="mt-5 w-full rounded-xl bg-brand-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-brand-700">Slot</p>
              <p className="font-mono text-3xl font-semibold text-brand-800">{slotCode}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">Ticket Number</p>
              <p className="font-mono text-lg font-semibold text-ink-900">{ticketNumber}</p>
            </div>
            <Badge tone="brand">{ticket.status || 'ACTIVE'}</Badge>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-ink-500">Vehicle</dt>
              <dd className="font-mono font-medium text-ink-800">{plate}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500">Type</dt>
              <dd className="text-ink-800">
                {ticket.vehicle?.type || ticket.vehicleType || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500">Lot</dt>
              <dd className="text-ink-800">{ticket.lotId || ticket.lot?.name || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500">Entry</dt>
              <dd className="text-ink-800">{formatDate(ticket.entryTime)}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="mx-auto flex max-w-3xl gap-3">
        <Button variant="secondary" fullWidth onClick={() => window.print()}>
          Print Ticket
        </Button>
        <Button fullWidth onClick={() => navigate(Routes.ENTRY_NEW)}>
          New Entry
        </Button>
      </div>
    </PageContainer>
  );
}
