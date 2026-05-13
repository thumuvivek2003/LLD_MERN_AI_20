import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriversTable from '../../../core/components/tables/DriversTable.jsx';
import UserBlockModal from '../components/UserBlockModal.jsx';
import { useUserManagement } from '../hooks/useUserManagement.js';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function DriversManagementPage() {
  const { users, loading, toggleBlock } = useUserManagement('drivers');
  const [target, setTarget] = useState(null);
  const navigate = useNavigate();

  const confirm = async () => { await toggleBlock(target); setTarget(null); };

  if (loading) return <Loader />;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Drivers</h2>
      <DriversTable drivers={users} onToggle={setTarget} onOpen={(d) => navigate(`/admin/drivers/${d.id}`)} />
      <UserBlockModal open={!!target} user={target} onClose={() => setTarget(null)} onConfirm={confirm} />
    </div>
  );
}
