import { QueryBuilder } from '../query/query.builder.js';
import { fieldTypeRegistry } from '../field/types/field-type.registry.js';
import { FIELD_TYPE, OPERATOR, OBJECT_STATUS } from '../../config/constants.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';

/** Picker options, the relationship graph, and resolver health. */
export class LookupService {
  constructor({ metadataCache, recordRepository, queryExecutor, lookupResolver }) {
    this.metadataCache = metadataCache;
    this.recordRepository = recordRepository;
    this.queryExecutor = queryExecutor;
    this.lookupResolver = lookupResolver;
  }

  /** Options for a lookup picker — index-served when the display field is indexed. */
  async options({ objectId, q, limit = 20 }) {
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);

    const displayFieldId = objectDef.primaryDisplayFieldId || objectDef.fields[0]?.fieldId;
    const secondaryField = objectDef.fields.find((f) => f.fieldId !== displayFieldId && f.type !== FIELD_TYPE.LOOKUP);

    const builder = QueryBuilder.for(objectId).paginate(1, limit).sortBy(displayFieldId, 'asc');
    if (q) builder.where(displayFieldId, OPERATOR.contains, q);

    const { records } = await this.queryExecutor.execute(objectDef, builder.build());
    return records.map((r) => ({
      recordId: r.recordId,
      displayName: r.displayName,
      secondary: secondaryField
        ? fieldTypeRegistry.get(secondaryField.type).display(r.recordJson?.[secondaryField.fieldId])
        : '',
    }));
  }

  /** The object graph the admin console draws: nodes = objects, edges = lookup fields. */
  async graph() {
    const all = await this.metadataCache.getAllObjects();
    const nodes = all.map((o) => ({
      objectId: o.objectId,
      label: o.label,
      icon: o.icon,
      color: o.color,
      status: o.status,
      fieldCount: o.fields?.length || 0,
    }));
    const edges = [];
    for (const obj of all) {
      for (const field of obj.fields || []) {
        if (field.type !== FIELD_TYPE.LOOKUP || !field.lookup?.objectId) continue;
        edges.push({
          from: obj.objectId,
          to: field.lookup.objectId,
          fieldId: field.fieldId,
          label: field.label,
          type: 'MANY_TO_ONE',
          onDelete: field.lookup.onDelete,
        });
      }
    }
    return { nodes, edges };
  }

  async stats() {
    const base = this.lookupResolver.stats();
    const { edges } = await this.graph();
    const all = await this.metadataCache.getAllObjects();
    const published = all.filter((o) => o.status === OBJECT_STATUS.PUBLISHED).length;
    return { ...base, relationships: edges.length, publishedObjects: published };
  }
}
