import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BidderAssignmentPanel from '../components/BidderAssignmentPanel.jsx';
import { adminAuctionApi } from '../services/adminAuction.api.js';
import Loader from '../../shared/components/Loader.jsx';

export default function AssignBiddersPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAuctionApi
      .getAuctionById(id)
      .then((d) => setAuction(d.auction))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader full />;
  if (!auction) return <p className="text-sm text-slate-500">Auction not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Assign bidders</h1>
        <p className="text-sm text-slate-500">{auction.item?.name}</p>
      </div>
      <BidderAssignmentPanel
        auction={auction}
        onAssigned={(ids) => setAuction({ ...auction, eligibleUserIds: ids })}
      />
    </div>
  );
}
