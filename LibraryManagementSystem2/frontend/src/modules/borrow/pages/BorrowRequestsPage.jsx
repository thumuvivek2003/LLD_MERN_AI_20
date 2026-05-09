import { useBorrowRequests } from '../hooks/useBorrowRequests.js';
import RequestTable from '../components/RequestTable.jsx';
import Loader from '../../../shared/components/ui/Loader.jsx';
import { approveRequest, rejectRequest } from '../services/borrowService.js';

export default function BorrowRequestsPage() {
  const { requests, loading, refetch } = useBorrowRequests();

  const handleApprove = async (id) => { await approveRequest(id); refetch(); };
  const handleReject = async (id) => { await rejectRequest(id); refetch(); };

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <h1 className="page-title">Borrow Requests</h1>
      <RequestTable requests={requests} onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
}
