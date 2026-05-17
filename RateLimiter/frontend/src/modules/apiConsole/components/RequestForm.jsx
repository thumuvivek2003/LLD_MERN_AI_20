import { useState } from 'react';
import { Button } from '../../shared/components/Button.jsx';

export function RequestForm({ defaultApiKey = '', onSubmit, loading }) {
  const [endpoint, setEndpoint] = useState('/test');
  const [apiKey, setApiKey] = useState(defaultApiKey);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ endpoint, apiKey });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label">API Key (x-api-key)</label>
        <input
          className="input font-mono text-xs"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="paste your api key"
        />
      </div>
      <div>
        <label className="label">Endpoint</label>
        <input
          className="input"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/test"
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Send Request
      </Button>
    </form>
  );
}

export default RequestForm;
