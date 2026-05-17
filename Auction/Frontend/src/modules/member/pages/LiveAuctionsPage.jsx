import { useEffect, useState } from 'react';
import { memberAuctionApi } from '../services/auction.api.js';
import AuctionLiveCard from '../components/AuctionLiveCard.jsx';
import Loader from '../../shared/components/Loader.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';

export default function LiveAuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberAuctionApi
      .getLiveAuctions()
      .then((d) => setAuctions(d.auctions || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Live auctions</h1>
        <p className="text-sm text-slate-500">Join an auction and place your bid.</p>
      </div>
      {loading ? (
        <Loader />
      ) : auctions.length === 0 ? (
        <EmptyState title="No live auctions" description="Check back later." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((a) => (
            <AuctionLiveCard key={a.id} auction={a} />
          ))}
        </div>
      )}
    </div>
  );
}
