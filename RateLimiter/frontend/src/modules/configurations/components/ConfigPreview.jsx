export function ConfigPreview({ config }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase text-slate-500 mb-2">
        Configuration Preview
      </div>
      <pre className="bg-slate-900 text-slate-50 text-xs rounded-lg p-3 overflow-auto max-h-72">
        {JSON.stringify(config || {}, null, 2)}
      </pre>
    </div>
  );
}

export default ConfigPreview;
