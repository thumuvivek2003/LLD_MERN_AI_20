import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { TicketCard } from '../../components/shared/TicketCard.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes as R } from '../../constants/routes.js';

export const TicketGeneratedPage = () => {
  const { state: ticket } = useLocation();
  const navigate = useNavigate();

  if (!ticket) return <Navigate to={R.ENTRY.NEW} replace />;

  return (
    <PageContainer title="Ticket Generated" subtitle="Step 3 of 3 — Hand this over to the driver">
      <div className="max-w-md space-y-4">
        <TicketCard ticket={ticket} />
        <div className="flex gap-2">
          <Button onClick={() => navigate(R.ENTRY.NEW)}>New entry</Button>
          <Button variant="secondary" onClick={() => window.print()}>Print</Button>
        </div>
      </div>
    </PageContainer>
  );
};
