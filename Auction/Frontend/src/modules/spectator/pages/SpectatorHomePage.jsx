import { useEffect, useState } from 'react';
import { spectatorApi } from '../services/spectator.api.js';
import SpectatorAuctionCard from '../components/SpectatorAuctionCard.jsx';
import Loader from '../../shared/components/Loader.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';

export default function SpectatorHomePage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    spectatorApi
      .getLive()
      .then((d) => setAuctions(d.auctions || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Live auctions</h1>
        <p className="text-sm text-slate-500">
          Watch ongoing auctions and follow live bid updates in real time.
        </p>
      </div>
      {loading ? (
        <Loader />
      ) : auctions.length === 0 ? (
        <EmptyState title="Nothing live right now" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((a) => (
            <SpectatorAuctionCard key={a.id} auction={a} />
          ))}
        </div>
      )}
    </div>
  );
}
