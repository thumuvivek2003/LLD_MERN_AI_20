import { useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';

export default function BlockUserPage() {
  const { userId } = useParams();
  return (
    <Card>
      <p className="font-semibold">Block / Unblock user</p>
      <p className="text-xs text-slate-500 mt-1">Use the table action on Riders or Drivers pages to toggle. User: {userId}</p>
    </Card>
  );
}
