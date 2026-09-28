import { useCallback } from 'react';
import recordsApi from '../../../core/api/records.api.js';
import useAsync from '../../../core/hooks/useAsync.js';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';

const PAGE_SIZE = 200; // CONTRACT §1 — `limit` maxes out at 200
const MAX_PAGES = 5;

/** Fields that make sensible report groupings and measures. */
export const groupableFields = (fields = []) =>
  fields.filter((field) =>
    [FIELD_TYPE.PICKLIST, FIELD_TYPE.TEXT, FIELD_TYPE.BOOLEAN, FIELD_TYPE.LOOKUP].includes(field.type),
  );

export const measurableFields = (fields = []) =>
  fields.filter((field) => [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(field.type));

const labelFor = (field, value, record) => {
  if (value === null || value === undefined || value === '') return '(empty)';
  if (field.type === FIELD_TYPE.BOOLEAN) return value ? 'Yes' : 'No';
  if (field.type === FIELD_TYPE.LOOKUP) {
    return record.resolved?.[field.fieldId]?.displayName || String(value);
  }
  const option = (field.options || []).find((item) => item.value === value);
  return option?.label || String(value);
};

/**
 * Client-side aggregation. The contract exposes no reporting endpoint, so reports
 * are computed from real records fetched through `GET /objects/:oid/records`.
 * Bounded to MAX_PAGES × PAGE_SIZE rows, and the page states that limit.
 */
export function useReport({ objectId, groupField, measureField, enabled = true }) {
  const fetcher = useCallback(async () => {
    if (!enabled || !objectId || !groupField) return null;

    const records = [];
    let totalPages = 1;
    for (let page = 1; page <= Math.min(totalPages, MAX_PAGES); page += 1) {
      // eslint-disable-next-line no-await-in-loop
      const batch = await recordsApi.list(objectId, { page, limit: PAGE_SIZE, status: 'ACTIVE' });
      const rows = Array.isArray(batch) ? batch : batch?.records || [];
      records.push(...rows);
      totalPages = rows.meta?.totalPages ?? batch?.meta?.totalPages ?? 1;
    }

    const buckets = new Map();
    records.forEach((record) => {
      const raw = record.recordJson?.[groupField.fieldId];
      const label = labelFor(groupField, raw, record);
      const measure = measureField ? Number(record.recordJson?.[measureField.fieldId]) || 0 : 1;
      buckets.set(label, (buckets.get(label) || 0) + measure);
    });

    const data = [...buckets.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);

    return {
      data,
      sampled: records.length,
      truncated: totalPages > MAX_PAGES,
      total: data.reduce((sum, item) => sum + item.value, 0),
    };
  }, [enabled, objectId, groupField, measureField]);

  return useAsync(fetcher, [enabled, objectId, groupField?.fieldId, measureField?.fieldId]);
}

export default useReport;
