import RequestCard from '../../../shared/components/cards/RequestCard.jsx';

export default function RequestQueueList({ requests = [] }) {
  if (!requests.length) {
    return <div className="text-sm text-slate-500 py-4">No requests.</div>;
  }
  return (
    <div className="space-y-2">
      {requests.map((r) => <RequestCard key={r.id} request={r} />)}
    </div>
  );
}
