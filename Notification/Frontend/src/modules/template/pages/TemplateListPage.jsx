import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { TemplateCard } from '../components/TemplateCard.jsx';
import { useTemplates } from '../hooks/useTemplates.js';

export function TemplateListPage() {
  const { templates, loading, error } = useTemplates();

  return (
    <DashboardLayout
      title="Templates"
      subtitle="Immutable, versioned message templates"
      actions={
        <Link to="/templates/new" className="btn-primary text-sm">
          + New Template
        </Link>
      }
    >
      {loading && <Loader />}
      {error && !loading && (
        <EmptyState title="Couldn't load templates" description={error} icon="⚠️" />
      )}
      {!loading && !error && templates.length === 0 && (
        <EmptyState
          title="No templates yet"
          description="Create your first template to send notifications."
          action={
            <Link to="/templates/new" className="btn-primary text-sm">
              + Create Template
            </Link>
          }
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </DashboardLayout>
  );
}
