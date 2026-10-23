import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { parkingService } from '../../services/parking.service.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes as R } from '../../constants/routes.js';

const METHODS = ['CASH', 'CARD', 'UPI'];

export const TicketFarePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [method, setMethod] = useState('CASH');

  const exit = useMutation({
    mutationFn: parkingService.exit,
    onSuccess: (result) => navigate(R.EXIT.SUCCESS, { state: result, replace: true }),
  });

  if (!state?.ticketNumber) return <Navigate to={R.EXIT.SEARCH} replace />;

  return (
    <PageContainer title="Confirm Exit" subtitle="Step 2 of 3 — Pay and release slot">
      <Card className="max-w-xl">
        <div className="text-sm text-slate-600">
          Ticket: <span className="font-mono font-semibold text-slate-900">{state.ticketNumber}</span>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-slate-700">Payment method</div>
          <div className="mt-2 flex gap-2">
            {METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`rounded-md border px-4 py-2 text-sm font-medium ${
                  method === m
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {exit.error && (
          <div className="mt-4 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {exit.error.error || 'Exit failed'}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
          <Button
            onClick={() => exit.mutate({ ticketNumber: state.ticketNumber, paymentMethod: method })}
            disabled={exit.isPending}
          >
            {exit.isPending ? 'Processing...' : 'Confirm payment'}
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
};
