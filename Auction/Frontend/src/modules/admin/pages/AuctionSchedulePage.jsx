import ScheduleCalendar from '../components/ScheduleCalendar.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useAuctionManagement } from '../hooks/useAuctionManagement.js';

export default function AuctionSchedulePage() {
  const { auctions, loading } = useAuctionManagement(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Schedule</h1>
        <p className="text-sm text-slate-500">Upcoming and ongoing auctions by day.</p>
      </div>
      {loading ? <Loader /> : <ScheduleCalendar auctions={auctions} />}
    </div>
  );
}
