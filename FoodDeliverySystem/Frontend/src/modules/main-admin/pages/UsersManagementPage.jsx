import { useEffect, useState } from 'react';
import * as api from '../services/admin.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Table } from '../../../shared/components/ui/Table.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { USER_ROLES, ROLE_LABEL } from '../../../core/constants/roles.constants.js';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.getUsers().then((r) => setUsers(r.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggleBlock = async (u) => {
    try { await api.blockUser(u.id, !u.isBlocked); showSuccessToast('Updated'); await load(); }
    catch (e) { showErrorToast(e.message); }
  };
  const changeRole = async (u, role) => {
    try { await api.updateUserRole(u.id, role); showSuccessToast('Role updated'); await load(); }
    catch (e) { showErrorToast(e.message); }
  };

  if (loading) return <Loader />;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role', label: 'Role',
      render: (u) => (
        <select className="border rounded px-2 py-1 text-sm" value={u.role} onChange={(e) => changeRole(u, e.target.value)}>
          {Object.values(USER_ROLES).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (u) => <Badge color={u.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
        {u.isBlocked ? 'Blocked' : 'Active'}
      </Badge>,
    },
    {
      key: 'actions', label: '',
      render: (u) => <Button size="sm" variant={u.isBlocked ? 'primary' : 'outline'} onClick={() => toggleBlock(u)}>
        {u.isBlocked ? 'Unblock' : 'Block'}
      </Button>,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Table columns={columns} rows={users} />
    </div>
  );
};
