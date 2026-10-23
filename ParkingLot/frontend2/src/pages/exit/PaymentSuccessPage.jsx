import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes } from '../../constants/routes.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate, formatDuration } from '../../utils/formatDate.js';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ticket, payment } = location.state || {};

  useEffect(() => {
    if (!ticket || !payment) navigate(Routes.EXIT_SEARCH, { replace: true });
  }, [ticket, payment, navigate]);

  if (!ticket || !payment) return null;

  return (
    <PageContainer title="Payment Successful" subtitle="The slot is now free">
      <Card className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
          ✓
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink-900">Payment Received</h3>
        <p className="mt-1 text-sm text-ink-500">{formatDate(payment.paidAt)}</p>

        <div className="my-6 rounded-2xl bg-emerald-50 p-5">
          <p className="text-xs uppercase tracking-wide text-emerald-700">Amount</p>
          <p className="mt-1 text-3xl font-semibold text-emerald-800">
            {formatCurrency(payment.amount)}
          </p>
          <p className="mt-1 text-xs text-emerald-700">via {payment.method}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-ink-500">Ticket</dt>
            <dd className="font-mono">
              {ticket.ticketNumber || ticket.number || ticket._id}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Status</dt>
            <dd className="font-medium">{ticket.status}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Entry</dt>
            <dd>{formatDate(ticket.entryTime)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Duration</dt>
            <dd>{formatDuration(ticket.entryTime, ticket.exitTime)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => window.print()}>
            Print Receipt
          </Button>
          <Button fullWidth onClick={() => navigate(Routes.EXIT_SEARCH)}>
            Next Vehicle
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
