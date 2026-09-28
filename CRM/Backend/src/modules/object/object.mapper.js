import { objectStateFactory } from './states/object-state.factory.js';

const base = (doc) => ({
  objectId: doc.objectId,
  label: doc.label,
  pluralLabel: doc.pluralLabel,
  apiName: doc.apiName,
  description: doc.description,
  icon: doc.icon,
  color: doc.color,
  status: doc.status,
  version: doc.version,
  primaryDisplayFieldId: doc.primaryDisplayFieldId,
  createdBy: doc.createdBy,
  updatedBy: doc.updatedBy,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const ObjectMapper = {
  /** List rows omit `fields[]` — CONTRACT.md §5.1. */
  toListItem(doc, recordCount = 0) {
    return { ...base(doc), recordCount, fieldCount: doc.fields?.length || 0 };
  },

  toDetail(doc, { recordCount = 0, fields = null } = {}) {
    const list = fields || doc.fields || [];
    return {
      ...base(doc),
      recordCount,
      fieldCount: list.length,
      fields: [...list].sort((a, b) => a.order - b.order),
      lifecycle: objectStateFactory.for(doc).describe(),
    };
  },
};
