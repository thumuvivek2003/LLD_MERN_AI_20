import { Link } from 'react-router-dom';
import { KeyRound, Lock, ShieldCheck, Users } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import permissionsApi from '../../../core/api/permissions.api.js';
import auditApi from '../../../core/api/audit.api.js';
import { useUser } from '../../../core/context/UserContext.jsx';
import { ROLE_LABEL } from '../../../shared/enums/role.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import AuditTable from '../../../core/components/table/AuditTable.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import Avatar from '../../../core/components/ui/Avatar.jsx';

/**
 * System → Security. Identity model, roles and the privileged actions recently taken.
 * MetaForce has no auth layer (CONTRACT §2) — this page states that plainly.
 */
export function SecurityPage() {
  const { users } = useUser();
  const roles = useAsync(() => permissionsApi.roles(), [], { initialData: [] });
  const privileged = useAsync(() => auditApi.list({ action: 'PUBLISHED', limit: 10 }), [], {
    initialData: [],
  });

  const roleList = Array.isArray(roles.data) ? roles.data : [];

  const userColumns = [
    {
      key: 'name',
      header: 'Identity',
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
    { key: 'role', header: 'Persona', render: (user) => <Badge tone="indigo">{ROLE_LABEL[user.role]}</Badge> },
    { key: 'roleId', header: 'Role', render: (user) => user.roleId || '—' },
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
      <PageHeader title="Security" subtitle="Identity, roles and privileged activity" icon={Lock} />

      <KpiGrid columns={3} className="mb-5">
        <KpiTile label="Identities" value={users.length} icon={Users} tone="indigo" />
        <KpiTile label="Roles" value={roleList.length} icon={ShieldCheck} tone="emerald" loading={roles.loading} />
        <KpiTile label="Auth Mode" value="Header" hint="x-user-id (no JWT)" icon={KeyRound} tone="amber" />
      </KpiGrid>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Identities" subtitle="Every principal the API accepts" icon={Users} />
          <DataTable columns={userColumns} rows={users} rowKey={(user) => user.userId} dense />
          <p className="border-t border-slate-100 px-5 py-3 text-[11px] leading-relaxed text-slate-500">
            MetaForce has no authentication layer. Identity is asserted with the{' '}
            <code className="rounded bg-slate-100 px-1 font-mono">x-user-id</code> header on every
            request (CONTRACT §2), and authorisation is enforced server-side per role.
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Roles"
            subtitle="Permission sets"
            icon={ShieldCheck}
            actions={
              <Link to="/admin/users" className="text-xs font-semibold text-accent hover:underline">
                Edit in admin
              </Link>
            }
          />
          <DataTable
            columns={roleColumns}
            rows={roleList}
            rowKey={(role) => role.roleId}
            loading={roles.loading}
            error={roles.error}
            onRetry={roles.reload}
            dense
          />
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Privileged Activity" subtitle="Recent schema publishes" icon={Lock} />
          <AuditTable
            entries={Array.isArray(privileged.data) ? privileged.data : []}
            loading={privileged.loading}
            error={privileged.error}
            onRetry={privileged.reload}
            dense
          />
        </Card>
      </div>
    </>
  );
}

export default SecurityPage;
