import { useEffect, useState } from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import permissionsApi from '../../../core/api/permissions.api.js';
import usersApi from '../../../core/api/users.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { useUser } from '../../../core/context/UserContext.jsx';
import { ROLE_LABEL } from '../../../shared/enums/role.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import Avatar from '../../../core/components/ui/Avatar.jsx';
import PermissionMatrix from './PermissionMatrix.jsx';

/** Admin screen 18 — Users & Roles plus the object permission matrix. */
export function UsersRolesPage() {
  const toast = useToast();
  const { users, refreshUsers } = useUser();
  const roles = useAsync(() => permissionsApi.roles(), [], { initialData: [] });
  const [roleId, setRoleId] = useState('');

  const roleList = Array.isArray(roles.data) ? roles.data : [];

  useEffect(() => {
    if (!roleId && roleList.length) setRoleId(roleList[0].roleId);
  }, [roleList, roleId]);

  const changeRole = async (userId, nextRoleId) => {
    try {
      await usersApi.updateRole(userId, nextRoleId);
      await refreshUsers();
      toast.success('Role updated');
    } catch (err) {
      toast.fromError(err, 'Could not update role');
    }
  };

  const userColumns = [
    {
      key: 'name',
      header: 'User',
      render: (user) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={user.name} initials={user.avatarInitials} size="sm" />
          <span>
            <span className="block font-semibold text-slate-800">{user.name}</span>
            <span className="block font-mono text-[11px] text-slate-400">{user.userId}</span>
          </span>
        </span>
      ),
    },
    { key: 'title', header: 'Title', render: (user) => user.title || ROLE_LABEL[user.role] },
    {
      key: 'role',
      header: 'Persona',
      render: (user) => <Badge tone="indigo">{user.role.replace('_', ' ')}</Badge>,
    },
    {
      key: 'roleId',
      header: 'Assigned Role',
      render: (user) => (
        <Select
          size="sm"
          className="w-44"
          value={user.roleId || ''}
          placeholder="No role"
          onChange={(event) => changeRole(user.userId, event.target.value)}
          options={roleList.map((role) => ({ value: role.roleId, label: role.name }))}
        />
      ),
    },
  ];

  const roleColumns = [
    { key: 'name', header: 'Role', className: 'font-semibold text-slate-800' },
    { key: 'description', header: 'Description' },
    { key: 'userCount', header: 'Users', align: 'center' },
    {
      key: 'isSystem',
      header: 'Type',
      render: (role) => (
        <Badge tone={role.isSystem ? 'slate' : 'emerald'}>{role.isSystem ? 'System' : 'Custom'}</Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Users & Roles"
        subtitle="Assign roles and control what each role can do with every object"
        icon={Users}
      />

      <div className="space-y-5">
        <Card>
          <CardHeader title="Users" subtitle="Seeded platform users" icon={Users} />
          <DataTable
            columns={userColumns}
            rows={users}
            rowKey={(user) => user.userId}
            emptyIcon={Users}
            emptyTitle="No users"
          />
        </Card>

        <Card>
          <CardHeader title="Roles" subtitle="Permission sets available on this tenant" icon={ShieldCheck} />
          <DataTable
            columns={roleColumns}
            rows={roleList}
            rowKey={(role) => role.roleId}
            loading={roles.loading}
            error={roles.error}
            onRetry={roles.reload}
            emptyIcon={ShieldCheck}
            emptyTitle="No roles defined"
          />
        </Card>

        <Card>
          <CardHeader
            title="Permission Matrix"
            subtitle="Object-level grants for the selected role"
            icon={ShieldCheck}
            actions={
              <Select
                size="sm"
                className="w-48"
                value={roleId}
                onChange={(event) => setRoleId(event.target.value)}
                options={roleList.map((role) => ({ value: role.roleId, label: role.name }))}
              />
            }
          />
          {roleId ? (
            <PermissionMatrix roleId={roleId} />
          ) : (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Select a role to edit.</p>
          )}
        </Card>
      </div>
    </>
  );
}

export default UsersRolesPage;
