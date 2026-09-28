import { LookupResolver } from './lookup.resolver.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';

const PREVIEW_LIMIT = 5;
const SUMMARY_FIELDS = 3;

/**
 * Reverse relationships.
 *
 * chat.md is emphatic about this: the parent stores nothing about its children.
 * "Customer → Orders" is a **query** over child records whose lookup field holds
 * the parent's id, computed on demand. Nothing here writes.
 */
export class LookupRelationshipService {
  constructor({ recordRepository, metadataCache, cascadeService }) {
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.cascadeService = cascadeService;
  }

  async relatedFor(objectId, recordId) {
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);
    const record = await this.recordRepository.findByRecordId(recordId);
    if (!record || record.objectId !== objectId) throw new NotFoundError('Record', recordId);

    const references = await this.cascadeService.inboundReferences(objectId);
    const out = [];

    for (const { objectDef: childObject, field } of references) {
      const count = await this.recordRepository.countByFieldValue(childObject.objectId, field.fieldId, recordId);
      const children = count
        ? await this.recordRepository.findByFieldValue(childObject.objectId, field.fieldId, recordId, { limit: PREVIEW_LIMIT })
        : [];

      const summaryFieldIds = childObject.fields
        .filter((f) => f.fieldId !== field.fieldId)
        .sort((a, b) => a.order - b.order)
        .slice(0, SUMMARY_FIELDS)
        .map((f) => f.fieldId);

      out.push({
        objectId: childObject.objectId,
        label: childObject.pluralLabel || childObject.label,
        icon: childObject.icon,
        color: childObject.color,
        fieldId: field.fieldId,
        fieldLabel: field.label,
        onDelete: field.lookup.onDelete,
        count,
        records: children.map((c) => ({
          recordId: c.recordId,
          displayName: c.displayName,
          summary: LookupResolver.summaryOf(childObject, c, summaryFieldIds),
        })),
      });
    }

    return out.sort((a, b) => b.count - a.count);
  }
}
