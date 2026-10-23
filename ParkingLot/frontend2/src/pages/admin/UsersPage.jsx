import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { generateColor } from '../../utils/generateColor.js';

const USERS = [
  { id: 1, name: 'Aarav Shah', email: 'aarav@parking.io', role: 'ADMIN', lot: 'Central Plaza' },
  { id: 2, name: 'Diya Patel', email: 'diya@parking.io', role: 'ATTENDANT', lot: 'Mall North' },
  { id: 3, name: 'Karan Mehta', email: 'karan@parking.io', role: 'ATTENDANT', lot: 'City Center' },
];

export function UsersPage() {
  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: generateColor(u.email) }}
          >
            {u.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
          </span>
          <div>
            <p className="font-medium text-ink-900">{u.name}</p>
            <p className="text-xs text-ink-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => <Badge tone={u.role === 'ADMIN' ? 'brand' : 'info'}>{u.role}</Badge>,
    },
    { key: 'lot', header: 'Assigned Lot' },
    {
      key: 'actions',
      header: '',
      render: () => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary">Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Users & Roles"
      subtitle="Assign attendants to parking lots"
      actions={<Button>+ Add User</Button>}
    >
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
        Preview only — the backend currently exposes <code>/api/auth/register</code> and
        <code> /api/auth/login</code>. A list endpoint isn’t available yet, so this table
        renders sample data.
      </div>
      <Table columns={columns} data={USERS} rowKey="id" />
    </PageContainer>
  );
}
