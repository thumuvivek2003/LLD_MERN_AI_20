// Client-side {{var}} replacement used by the live preview in TemplateEditor.
// The backend is the source of truth at send time; this is only for preview.
export function renderTemplate(template, variables = {}) {
  if (!template) return '';
  return String(template).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const value = key
      .split('.')
      .reduce((acc, part) => (acc == null ? acc : acc[part]), variables);
    return value == null ? `{{${key}}}` : String(value);
  });
}
