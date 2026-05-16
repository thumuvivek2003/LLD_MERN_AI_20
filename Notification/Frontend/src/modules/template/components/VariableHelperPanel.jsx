// Helper panel — lists detected {{vars}} and lets the operator paste sample
// values for live preview.
import { useMemo } from 'react';

function extractVars(text) {
  if (!text) return [];
  const re = /\{\{\s*([\w.]+)\s*\}\}/g;
  const out = new Set();
  let m;
  while ((m = re.exec(text)) !== null) out.add(m[1]);
  return Array.from(out);
}

export function VariableHelperPanel({
  subjectTemplate,
  bodyTemplate,
  variables,
  onChange,
}) {
  const detected = useMemo(
    () => extractVars(`${subjectTemplate || ''}\n${bodyTemplate || ''}`),
    [subjectTemplate, bodyTemplate],
  );

  return (
    <div className="card p-4">
      <h4 className="text-sm font-semibold text-slate-900">Variables</h4>
      <p className="text-xs text-slate-500 mt-0.5">
        Use <code>{'{{name}}'}</code> in your template, fill values here.
      </p>
      {detected.length === 0 ? (
        <div className="mt-3 text-xs text-slate-400">
          No variables detected yet.
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {detected.map((v) => (
            <div key={v}>
              <label className="label">{v}</label>
              <input
                value={variables?.[v] ?? ''}
                onChange={(e) => onChange({ ...variables, [v]: e.target.value })}
                className="input"
                placeholder={`Sample value for ${v}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
