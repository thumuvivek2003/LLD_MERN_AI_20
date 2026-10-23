import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { TicketCard } from '../../components/shared/TicketCard.jsx';
import { PaymentCard } from '../../components/shared/PaymentCard.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes as R } from '../../constants/routes.js';

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.ticket) return <Navigate to={R.EXIT.SEARCH} replace />;

  return (
    <PageContainer title="Payment Successful" subtitle="Step 3 of 3 — Slot released">
      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        <TicketCard ticket={state.ticket} />
        <PaymentCard payment={state.payment} />
      </div>
      <div className="mt-2">
        <Button onClick={() => navigate(R.EXIT.SEARCH)}>New exit</Button>
      </div>
    </PageContainer>
  );
};
