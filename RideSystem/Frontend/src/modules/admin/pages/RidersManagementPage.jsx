import { useState } from 'react';
import RidersTable from '../../../core/components/tables/RidersTable.jsx';
import UserBlockModal from '../components/UserBlockModal.jsx';
import { useUserManagement } from '../hooks/useUserManagement.js';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function RidersManagementPage() {
  const { users, loading, toggleBlock } = useUserManagement('riders');
  const [target, setTarget] = useState(null);

  const confirm = async () => {
    await toggleBlock(target);
    setTarget(null);
  };

  if (loading) return <Loader />;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Riders</h2>
      <RidersTable riders={users} onToggle={setTarget} />
      <UserBlockModal open={!!target} user={target} onClose={() => setTarget(null)} onConfirm={confirm} />
    </div>
  );
}
