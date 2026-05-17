import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuctionForm from '../components/AuctionForm.jsx';
import { useAuctionManagement } from '../hooks/useAuctionManagement.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function CreateAuctionPage() {
  const { create } = useAuctionManagement(false);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      const auction = await create(payload);
      navigate(ROUTES.ADMIN_AUCTION_DETAILS(auction.id));
    } catch {
      /* toast handled */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Create auction</h1>
        <p className="text-sm text-slate-500">
          Configure item, schedule, increment rule, and eligible bidders.
        </p>
      </div>
      <AuctionForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
