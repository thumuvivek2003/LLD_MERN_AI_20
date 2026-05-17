import { useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin.js';
import { GroupTable } from '../components/GroupTable.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';

export function GroupsPage() {
  const { groups, loading, loadGroups } = useAdmin();

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold text-wa-dark">Groups</h1>
      {loading && groups.length === 0 ? <Loader /> : <GroupTable groups={groups} />}
    </div>
  );
}
