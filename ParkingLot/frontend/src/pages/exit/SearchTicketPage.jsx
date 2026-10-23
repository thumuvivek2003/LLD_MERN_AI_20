import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes as R } from '../../constants/routes.js';

export const SearchTicketPage = () => {
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState('');

  const handleNext = () => {
    if (!ticketNumber.trim()) return;
    navigate(R.EXIT.FARE, { state: { ticketNumber: ticketNumber.trim() } });
  };

  return (
    <PageContainer title="Exit" subtitle="Step 1 of 3 — Find ticket">
      <Card className="max-w-xl">
        <div className="space-y-3">
          <Input
            label="Ticket number"
            placeholder="TKT-XXXXXX"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleNext}>Continue</Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
