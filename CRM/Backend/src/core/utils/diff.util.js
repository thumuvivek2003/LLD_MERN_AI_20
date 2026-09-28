const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/**
 * Field-level old-vs-new diff used by the audit engine.
 * `fields` supplies the human label so history reads "City: Pune → Hyderabad".
 */
export function diffRecordJson(before = {}, after = {}, fields = []) {
  const byId = new Map(fields.map((f) => [f.fieldId, f]));
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changes = [];
  for (const key of keys) {
    if (same(before[key], after[key])) continue;
    changes.push({
      fieldId: key,
      label: byId.get(key)?.label || key,
      from: before[key] ?? null,
      to: after[key] ?? null,
    });
  }
  return changes;
}

/** Schema diff between two versions of an ObjectDefinition. */
export function diffObjectDefinition(before = {}, after = {}) {
  const diff = [];
  for (const prop of ['label', 'pluralLabel', 'description', 'icon', 'color', 'status', 'primaryDisplayFieldId']) {
    if (!same(before[prop], after[prop])) {
      diff.push({ kind: 'OBJECT', target: prop, from: before[prop] ?? null, to: after[prop] ?? null });
    }
  }
  const beforeFields = new Map((before.fields || []).map((f) => [f.fieldId, f]));
  const afterFields = new Map((after.fields || []).map((f) => [f.fieldId, f]));

  for (const [fieldId, field] of afterFields) {
    const prev = beforeFields.get(fieldId);
    if (!prev) {
      diff.push({ kind: 'FIELD_ADDED', target: field.label, from: null, to: field.type });
      continue;
    }
    for (const prop of ['label', 'type', 'required', 'unique', 'searchable', 'sortable', 'filterable', 'readOnly', 'order']) {
      if (!same(prev[prop], field[prop])) {
        diff.push({ kind: 'FIELD_UPDATED', target: `${field.label}.${prop}`, from: prev[prop] ?? null, to: field[prop] ?? null });
      }
    }
  }
  for (const [fieldId, field] of beforeFields) {
    if (!afterFields.has(fieldId)) {
      diff.push({ kind: 'FIELD_REMOVED', target: field.label, from: field.type, to: null });
    }
  }
  return diff;
}

export const summariseDiff = (diff = []) => {
  if (!diff.length) return 'No schema change';
  const added = diff.filter((d) => d.kind === 'FIELD_ADDED').length;
  const removed = diff.filter((d) => d.kind === 'FIELD_REMOVED').length;
  const updated = diff.length - added - removed;
  const parts = [];
  if (added) parts.push(`${added} field${added > 1 ? 's' : ''} added`);
  if (removed) parts.push(`${removed} field${removed > 1 ? 's' : ''} removed`);
  if (updated) parts.push(`${updated} change${updated > 1 ? 's' : ''}`);
  return parts.join(', ');
};
