import { Link } from 'react-router-dom';
import { LayoutGrid, Star } from 'lucide-react';
import useWorkspace from '../hooks/useWorkspace.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import ObjectGrid from '../../../core/components/layout/ObjectGrid.jsx';
import Button from '../../../core/components/ui/Button.jsx';

/** Business sidebar → Favorites. Objects the user starred on My Objects. */
export function FavoritesPage() {
  const { loading, error, reload } = useMetadata();
  const { favoriteObjects } = useWorkspace();

  return (
    <>
      <PageHeader title="Favorites" subtitle="Objects you starred for quick access" icon={Star} />

      <ObjectGrid
        objects={favoriteObjects}
        loading={loading}
        error={error}
        onRetry={reload}
        linkTo={(object) => `/business/objects/${object.objectId}/records`}
        emptyTitle="No favorites yet"
        emptyDescription="Star an object on My Objects and it will show up here."
        emptyAction={
          <Button as={Link} to="/business/objects" size="sm" icon={LayoutGrid}>
            Browse My Objects
          </Button>
        }
      />
    </>
  );
}

export default FavoritesPage;
