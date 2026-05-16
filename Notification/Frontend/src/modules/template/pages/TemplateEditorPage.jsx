import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { TemplateEditorForm } from '../components/TemplateEditorForm.jsx';
import { TemplatePreviewPane } from '../components/TemplatePreviewPane.jsx';
import { VariableHelperPanel } from '../components/VariableHelperPanel.jsx';
import {
  fetchTemplate,
  createTemplate,
  createTemplateVersion,
} from '../services/template.service.js';

const EMPTY = {
  name: '',
  eventType: '',
  channel: 'EMAIL',
  subjectTemplate: '',
  bodyTemplate: '',
};

export function TemplateEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState(EMPTY);
  const [variables, setVariables] = useState({ name: 'Vivek', amount: 500 });
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    setLoading(true);
    fetchTemplate(id)
      .then((t) => {
        if (cancelled) return;
        const active =
          t.versions?.find((v) => v.isActive) ||
          t.versions?.[t.versions.length - 1];
        setForm({
          name: t.name,
          eventType: t.eventType,
          channel: t.channel,
          subjectTemplate: active?.subjectTemplate || '',
          bodyTemplate: active?.bodyTemplate || '',
        });
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createTemplate(form);
        navigate(`/templates/${created.id || ''}`);
      } else {
        await createTemplateVersion(id, {
          subjectTemplate: form.subjectTemplate,
          bodyTemplate: form.bodyTemplate,
        });
        navigate(`/templates/${id}/versions`);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader />;
  if (error && !form.name)
    return <EmptyState title="Couldn't load template" description={error} icon="⚠️" />;

  return (
    <DashboardLayout
      title={isNew ? 'New Template' : `Edit · ${form.name}`}
      subtitle={
        isNew
          ? 'First save creates v1.'
          : 'Saving creates a new immutable version (old ones stay queryable).'
      }
      actions={
        <>
          {!isNew && (
            <Link to={`/templates/${id}/versions`} className="btn-ghost text-sm">
              Versions
            </Link>
          )}
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="btn-primary text-sm"
          >
            {submitting ? 'Saving…' : isNew ? 'Create Template' : 'Save as new version'}
          </button>
        </>
      }
    >
      {error && (
        <div className="card p-3 text-sm text-red-700 bg-red-50 border-red-100">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <TemplateEditorForm value={form} onChange={setForm} lockMeta={!isNew} />
        </div>
        <div className="space-y-4">
          <VariableHelperPanel
            subjectTemplate={form.subjectTemplate}
            bodyTemplate={form.bodyTemplate}
            variables={variables}
            onChange={setVariables}
          />
          <TemplatePreviewPane
            channel={form.channel}
            subjectTemplate={form.subjectTemplate}
            bodyTemplate={form.bodyTemplate}
            variables={variables}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
