import { Link } from 'react-router-dom';
import { LayoutGrid, LogOut, Settings, ShieldCheck, Star } from 'lucide-react';
import { useUser } from '../../../core/context/UserContext.jsx';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import usePermission from '../../../core/hooks/usePermission.js';
import useWorkspace from '../hooks/useWorkspace.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Avatar from '../../../core/components/ui/Avatar.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { ROLE_LABEL } from '../../../shared/enums/role.enum.js';
import { objectGrants } from '../../../core/utils/permission.js';

/** Business sidebar → Settings. Profile, effective permissions and workspace preferences. */
export function BusinessSettingsPage() {
  const { me, signOut } = useUser();
  const { objects } = useMetadata();
  const permission = usePermission();
  const { favorites } = useWorkspace();

  return (
    <>
      <PageHeader title="Settings" subtitle="Your profile, access and preferences" icon={Settings} />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Profile" subtitle="Who you are acting as" icon={Settings} />
          <div className="flex items-center gap-4 p-5">
            <Avatar name={me?.name} initials={me?.avatarInitials} size="xl" />
            <div className="min-w-0">
              <p className="text-base font-bold text-slate-900">{me?.name}</p>
              <p className="text-sm text-slate-500">{ROLE_LABEL[me?.role]}</p>
              <p className="mt-1 font-mono text-[11px] text-slate-400">{me?.userId}</p>
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-100 px-5 py-3.5">
            <Button as={Link} to="/" variant="secondary" icon={LogOut} onClick={signOut}>
              Switch user
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="My Access"
            subtitle="What your role can do with each object"
            icon={ShieldCheck}
          />
          <ul className="divide-y divide-slate-100 px-5">
            {objects.map((object) => {
              const grants = objectGrants(me, object.objectId);
              const granted = Object.entries(grants).filter(([, value]) => value);
              return (
                <li key={object.objectId} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                    {object.label}
                  </span>
                  <span className="flex flex-wrap justify-end gap-1">
                    {granted.length ? (
                      granted.map(([key]) => (
                        <Badge key={key} tone="emerald">
                          {key}
                        </Badge>
                      ))
                    ) : (
                      <Badge tone="slate">no access</Badge>
                    )}
                  </span>
                </li>
              );
            })}
            {!objects.length && (
              <li className="py-6 text-center text-sm text-slate-500">No objects available.</li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Workspace" subtitle="Personal preferences stored on this device" icon={Star} />
          <dl className="divide-y divide-slate-100 px-5">
            <Row label="Favorite objects" value={`${favorites.length}`} />
            <Row label="Objects visible to me" value={`${objects.length}`} />
            <Row label="Console" value={permission.isBusiness ? 'Business' : 'Elevated'} />
          </dl>
          <div className="flex justify-end border-t border-slate-100 px-5 py-3.5">
            <Button as={Link} to="/business/objects" variant="secondary" icon={LayoutGrid}>
              Manage favorites
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between py-3">
    <dt className="text-sm text-slate-600">{label}</dt>
    <dd className="text-sm font-semibold text-slate-900">{value}</dd>
  </div>
);

export default BusinessSettingsPage;
