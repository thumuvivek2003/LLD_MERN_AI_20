/**
 * Tiny {{var}} template engine.
 * Supports nested keys with dot notation: {{user.name}}.
 * Missing keys render as empty string (no exceptions thrown).
 */
const TOKEN_RE = /\{\{\s*([\w.$]+)\s*\}\}/g;

function resolvePath(obj, path) {
  if (obj == null) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function injectVariables(str, payload) {
  if (typeof str !== 'string' || !str) return '';
  if (!payload || typeof payload !== 'object') return str;
  return str.replace(TOKEN_RE, (_match, path) => {
    const v = resolvePath(payload, path);
    if (v === undefined || v === null) return '';
    return String(v);
  });
}
