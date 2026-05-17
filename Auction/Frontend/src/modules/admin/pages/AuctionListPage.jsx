import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AuctionTable from '../components/AuctionTable.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useAuctionManagement } from '../hooks/useAuctionManagement.js';
import { AUCTION_STATUS } from '../../shared/constants/socketEvents.constant.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';

const FILTERS = [
  { value: '', label: 'All' },
  { value: AUCTION_STATUS.OPEN, label: 'Open' },
  { value: AUCTION_STATUS.SCHEDULED, label: 'Scheduled' },
  { value: AUCTION_STATUS.CLOSED, label: 'Closed' },
];

export default function AuctionListPage() {
  const { auctions, loading, load } = useAuctionManagement(true);
  const [status, setStatus] = useState('');

  function applyFilter(value) {
    setStatus(value);
    load(value ? { status: value } : {});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Auctions</h1>
          <p className="text-sm text-slate-500">Manage all auctions across statuses.</p>
        </div>
        <Link to={ROUTES.ADMIN_AUCTION_NEW} className="btn-primary">
          <Plus size={16} /> New auction
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value || 'all'}
            onClick={() => applyFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              status === f.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : <AuctionTable auctions={auctions} />}
    </div>
  );
}
