import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpDown, ListTree, Plus } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useFields from '../../../core/hooks/useFields.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import SearchInput from '../../../core/components/ui/SearchInput.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import FieldTable from '../components/FieldTable.jsx';

/** Admin screen 6 — Fields list for one object. */
export function FieldListPage() {
  const { oid } = useParams();
  const toast = useToast();
  const { object } = useObject(oid);
  const { fields, loading, error, reload, remove } = useFields(oid);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return fields;
    return fields.filter(
      (field) =>
        field.label.toLowerCase().includes(term) || field.apiName.toLowerCase().includes(term),
    );
  }, [fields, search]);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await remove(deleting.fieldId);
      toast.success('Field deleted', `${deleting.label} removed from ${object?.label ?? 'object'}`);
      setDeleting(null);
    } catch (err) {
      toast.fromError(err, 'Could not delete field');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title={`Fields: ${object?.label ?? '…'}`}
        subtitle="Manage fields of this object"
        icon={ListTree}
        back={`/admin/objects/${oid}`}
        breadcrumbs={[
          { label: 'Objects', to: '/admin/objects' },
          { label: object?.label ?? oid, to: `/admin/objects/${oid}` },
          { label: 'Fields' },
        ]}
        actions={
          <>
            <Button
              as={Link}
              to={`/admin/objects/${oid}/fields/reorder`}
              variant="secondary"
              icon={ArrowUpDown}
            >
              Reorder Fields
            </Button>
            <Button as={Link} to={`/admin/objects/${oid}/fields/new`} icon={Plus}>
              Add Field
            </Button>
          </>
        }
      />

      <Card>
        <div className="border-b border-slate-100 p-4">
          <SearchInput
            className="max-w-sm"
            value={search}
            onChange={setSearch}
            placeholder="Search fields…"
          />
        </div>
        <FieldTable
          objectId={oid}
          fields={filtered}
          loading={loading}
          error={error}
          onRetry={reload}
          onDelete={setDeleting}
          emptyAction={
            <Button as={Link} to={`/admin/objects/${oid}/fields/new`} size="sm" icon={Plus}>
              Add Field
            </Button>
          }
        />
      </Card>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete field "${deleting?.label ?? ''}"?`}
        description="The field stops rendering on every form and list."
        note="Blocked with a CONFLICT if another object's lookup uses it as a display field."
        confirmLabel="Delete field"
        loading={busy}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default FieldListPage;
