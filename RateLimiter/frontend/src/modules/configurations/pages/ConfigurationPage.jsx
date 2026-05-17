import { useEffect, useState } from 'react';
import { ConfigForm } from '../components/ConfigForm.jsx';
import { ConfigPreview } from '../components/ConfigPreview.jsx';
import { useConfig, useSaveConfig } from '../hooks/useConfiguration.js';
import { Loader } from '../../shared/components/Loader.jsx';
import { EmptyState } from '../../shared/components/EmptyState.jsx';

export function ConfigurationPage() {
  const { config, loading, error, setConfig } = useConfig();
  const { save, saving, error: saveError } = useSaveConfig();
  const [draft, setDraft] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (config) setDraft(config);
  }, [config]);

  if (loading) return <Loader />;
  if (error && !config) {
    return (
      <EmptyState title="Could not load config" description={error} />
    );
  }

  const handleSubmit = async (values) => {
    try {
      const merged = await save(values);
      setConfig(merged);
      setDraft(merged);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (_) {
      // surfaced via saveError
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">
          Rate Limit Configuration
        </h2>
        <ConfigForm
          initial={config}
          onChange={setDraft}
          onSubmit={handleSubmit}
          saving={saving}
        />
        {saveError && (
          <div className="text-sm text-red-600 mt-3">{saveError}</div>
        )}
        {savedAt && (
          <div className="text-xs text-emerald-600 mt-3">
            Saved at {savedAt}
          </div>
        )}
      </div>
      <ConfigPreview config={draft || config} />
    </div>
  );
}

export default ConfigurationPage;
