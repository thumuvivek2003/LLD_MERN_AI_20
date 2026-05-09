import { Link } from 'react-router-dom';
import Table from '../../../shared/components/ui/Table.jsx';
import Badge from '../../../shared/components/ui/Badge.jsx';
import UserStatusToggle from './UserStatusToggle.jsx';

export default function UserTable({ users, onActivate, onDeactivate }) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', render: (u) => (
      <Badge label={u.status} variant={u.status === 'ACTIVE' ? 'success' : 'danger'} />
    )},
    { key: 'actions', label: 'Actions', render: (u) => (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link to={`/admin/users/${u._id}`}>View</Link>
        <UserStatusToggle user={u} onActivate={onActivate} onDeactivate={onDeactivate} />
      </div>
    )},
  ];
  return <Table columns={columns} data={users} />;
}
