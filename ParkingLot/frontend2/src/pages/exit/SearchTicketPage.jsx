import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes } from '../../constants/routes.js';
import { required } from '../../utils/validators.js';

export function SearchTicketPage() {
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!required(ticketNumber)) {
      setError('Enter a ticket number');
      return;
    }
    navigate(Routes.EXIT_FARE, {
      state: { ticketNumber: ticketNumber.trim().toUpperCase() },
    });
  };

  return (
    <PageContainer title="Exit Vehicle" subtitle="Enter the ticket number to begin">
      <Card className="mx-auto max-w-md">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
              🎫
            </div>
          </div>
          <Input
            label="Ticket Number"
            name="ticketNumber"
            placeholder="TK-123456"
            value={ticketNumber}
            onChange={(e) => {
              setTicketNumber(e.target.value.toUpperCase());
              setError('');
            }}
            error={error}
            autoFocus
          />
          <Button type="submit" fullWidth size="lg">
            Continue
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
