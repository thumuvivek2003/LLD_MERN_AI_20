import { INDEX_STATUS } from '../../config/constants.js';

/** Health is measured, not stored: index doc count vs live active record count. */
export function computeHealth(def, activeRecordCount) {
  if (def.status === INDEX_STATUS.FAILED) return 0;
  if (def.status === INDEX_STATUS.INACTIVE) return 0;
  if (def.status === INDEX_STATUS.BUILDING) return 50;
  if (!activeRecordCount) return def.docCount ? 100 : 100;
  const drift = Math.abs(activeRecordCount - def.docCount) / activeRecordCount;
  return Math.max(0, Math.round(100 * (1 - Math.min(1, drift))));
}

export const IndexMapper = {
  toListItem(def, { objectLabel, fieldLabel, activeRecordCount }) {
    return {
      indexId: def.indexId,
      name: def.name,
      objectId: def.objectId,
      objectLabel: objectLabel || def.objectId,
      fieldId: def.fieldId,
      fieldLabel: fieldLabel || def.fieldId,
      type: def.type,
      status: def.status,
      docCount: def.docCount,
      keyCount: def.keyCount,
      sizeBytes: def.sizeBytes,
      health: computeHealth(def, activeRecordCount),
      lastBuiltAt: def.lastBuiltAt,
      buildMs: def.buildMs,
    };
  },

  toDetail(def, context, performance) {
    return {
      ...IndexMapper.toListItem(def, context),
      history: (def.history || []).slice(-20).reverse(),
      performance,
    };
  },
};
