import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { TemplateVersionTable } from '../components/TemplateVersionTable.jsx';
import { fetchTemplate } from '../services/template.service.js';

export function TemplateVersionHistoryPage() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchTemplate(id)
      .then((t) => !cancelled && setTemplate(t))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader />;
  if (error || !template)
    return <EmptyState title="Couldn't load history" description={error} icon="⚠️" />;

  return (
    <DashboardLayout
      title={`Version History · ${template.name}`}
      subtitle="Older versions stay queryable for audit & re-rendering"
      actions={
        <Link to={`/templates/${id}`} className="btn-ghost text-sm">
          ← Editor
        </Link>
      }
    >
      <Card>
        <TemplateVersionTable versions={template.versions || []} />
      </Card>
    </DashboardLayout>
  );
}
