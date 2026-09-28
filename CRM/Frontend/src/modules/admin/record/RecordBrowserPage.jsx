import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Table2 } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import ObjectGrid from '../../../core/components/layout/ObjectGrid.jsx';
import SearchInput from '../../../core/components/ui/SearchInput.jsx';
import Button from '../../../core/components/ui/Button.jsx';

/** Admin sidebar → Records. Pick an object, then browse its records. */
export function RecordBrowserPage() {
  const { objects, loading, error, reload } = useMetadata();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return objects;
    return objects.filter(
      (object) =>
        object.label.toLowerCase().includes(term) || object.apiName?.toLowerCase().includes(term),
    );
  }, [objects, search]);

  return (
    <>
      <PageHeader
        title="Records"
        subtitle="Choose an object to browse, search and bulk-edit its records"
        icon={Table2}
        actions={
          <Button as={Link} to="/admin/objects/new" variant="secondary" icon={Plus}>
            New Object
          </Button>
        }
      />

      <div className="mb-5 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search objects…" />
      </div>

      <ObjectGrid
        objects={filtered}
        loading={loading}
        error={error}
        onRetry={reload}
        showStatus
        linkTo={(object) => `/admin/records/${object.objectId}`}
        emptyTitle={search ? 'No objects match your search' : 'No objects yet'}
        emptyDescription={
          search ? 'Try a different term.' : 'Create an object before you can store records.'
        }
        emptyAction={
          !search ? (
            <Button as={Link} to="/admin/objects/new" size="sm" icon={Plus}>
              New Object
            </Button>
          ) : null
        }
      />
    </>
  );
}

export default RecordBrowserPage;
