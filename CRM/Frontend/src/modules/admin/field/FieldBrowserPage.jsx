import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListTree, Plus } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import useFields from '../../../core/hooks/useFields.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import SearchInput from '../../../core/components/ui/SearchInput.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { EmptyState } from '../../../core/components/ui/EmptyState.jsx';
import FieldTable from '../components/FieldTable.jsx';

/** Admin sidebar → Fields. Browse the field catalogue one object at a time. */
export function FieldBrowserPage() {
  const { objects, loading: objectsLoading } = useMetadata();
  const [objectId, setObjectId] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!objectId && objects.length) setObjectId(objects[0].objectId);
  }, [objects, objectId]);

  const { fields, loading, error, reload } = useFields(objectId);
  const selected = objects.find((object) => object.objectId === objectId);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return fields;
    return fields.filter(
      (field) =>
        field.label.toLowerCase().includes(term) || field.apiName.toLowerCase().includes(term),
    );
  }, [fields, search]);

  if (!objectsLoading && !objects.length) {
    return (
      <>
        <PageHeader title="Fields" subtitle="Browse the field catalogue" icon={ListTree} />
        <Card>
          <EmptyState
            icon={ListTree}
            title="No objects yet"
            description="Create an object before you can define fields."
            action={
              <Button as={Link} to="/admin/objects/new" size="sm" icon={Plus}>
                New Object
              </Button>
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Fields"
        subtitle="Browse and manage fields across every object"
        icon={ListTree}
        actions={
          objectId && (
            <Button as={Link} to={`/admin/objects/${objectId}/fields/new`} icon={Plus}>
              Add Field
            </Button>
          )
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-56"
            value={objectId}
            onChange={(event) => setObjectId(event.target.value)}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
          <SearchInput
            className="min-w-[200px] flex-1"
            value={search}
            onChange={setSearch}
            placeholder="Search fields by label or API name…"
          />
          <span className="text-xs text-slate-400">
            {filtered.length} of {fields.length} fields
            {selected ? ` on ${selected.label}` : ''}
          </span>
        </div>

        <FieldTable
          objectId={objectId}
          fields={filtered}
          loading={loading || objectsLoading}
          error={error}
          onRetry={reload}
          emptyAction={
            objectId ? (
              <Button as={Link} to={`/admin/objects/${objectId}/fields/new`} size="sm" icon={Plus}>
                Add Field
              </Button>
            ) : null
          }
        />
      </Card>
    </>
  );
}

export default FieldBrowserPage;
