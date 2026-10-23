import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Routes } from '../../constants/routes.js';
import { PaymentMethod } from '../../constants/statuses.js';
import { useExitVehicle } from '../../features/tickets/hooks/useTickets.js';

const METHODS = [
  { id: PaymentMethod.CASH, label: 'Cash', icon: '💵' },
  { id: PaymentMethod.CARD, label: 'Card', icon: '💳' },
  { id: PaymentMethod.UPI, label: 'UPI', icon: '📱' },
];

export function TicketFarePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketNumber = location.state?.ticketNumber;
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const exitMutation = useExitVehicle();

  useEffect(() => {
    if (!ticketNumber) navigate(Routes.EXIT_SEARCH, { replace: true });
  }, [ticketNumber, navigate]);

  const onCollect = () => {
    exitMutation.mutate(
      { ticketNumber, paymentMethod },
      {
        onSuccess: ({ ticket, payment }) => {
          navigate(Routes.EXIT_SUCCESS, {
            state: { ticket, payment },
          });
        },
      }
    );
  };

  const apiError =
    exitMutation.error?.response?.data?.message || exitMutation.error?.message;

  return (
    <PageContainer title="Ticket & Payment" subtitle="Select payment method to complete exit">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">Ticket Number</p>
              <p className="font-mono text-lg font-semibold text-ink-900">{ticketNumber}</p>
            </div>
            <Badge tone="brand">ACTIVE</Badge>
          </div>

          <div className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600">
            Fare is calculated by the server using the active pricing strategy
            (entry time → exit time, vehicle type). Click <b>Collect & Free Slot</b> to
            finalize.
          </div>

          <div className="border-t border-ink-100 pt-4">
            <p className="mb-2 text-sm font-medium text-ink-700">Payment Method</p>
            <div className="grid grid-cols-3 gap-3">
              {METHODS.map((m) => {
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={[
                      'flex flex-col items-center gap-1 rounded-xl border p-3 text-sm transition',
                      active
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300',
                    ].join(' ')}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {apiError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {apiError}
            </div>
          )}
        </Card>

        <Card className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-500">Method</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{paymentMethod}</p>
          </div>
          <Button
            fullWidth
            size="lg"
            variant="success"
            onClick={onCollect}
            disabled={exitMutation.isPending}
          >
            {exitMutation.isPending ? 'Processing…' : 'Collect & Free Slot'}
          </Button>
        </Card>
      </div>
    </PageContainer>
  );
}
