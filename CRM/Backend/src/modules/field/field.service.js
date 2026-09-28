import { FieldFactory } from './field.factory.js';
import { fieldTypeRegistry } from './types/field-type.registry.js';
import { objectStateFactory } from '../object/states/object-state.factory.js';
import { FIELD_TYPE, EVENT_TYPE } from '../../config/constants.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { ConflictError } from '../../core/exceptions/conflict.error.js';

/**
 * Field Engine.
 *
 * Owns the field list of one object. Notably it does **not** build indexes:
 * marking a field searchable publishes `field.searchable.enabled` and a
 * subscriber does the work — chat.md's "make it automatic, that's event-driven
 * design" recommendation.
 */
export class FieldService {
  constructor({ objectRepository, recordRepository, metadataCache, versionService, lookupGuard, eventBus }) {
    this.objectRepository = objectRepository;
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.versionService = versionService;
    this.lookupGuard = lookupGuard;
    this.eventBus = eventBus;
  }

  catalogue() {
    return fieldTypeRegistry.catalogue();
  }

  async #require(objectId) {
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);
    return objectDef;
  }

  async list(objectId) {
    const objectDef = await this.#require(objectId);
    return [...objectDef.fields].sort((a, b) => a.order - b.order);
  }

  async add(objectId, payload, actor) {
    const before = await this.#require(objectId);
    objectStateFactory.for(before).assertCanEditSchema(before);

    if (payload.type === FIELD_TYPE.LOOKUP) {
      await this.lookupGuard.assertValidTarget(payload.lookup);
      await this.lookupGuard.assertNoCycle(objectId, payload.lookup.objectId);
    }

    const seq = (before.fieldSeq || before.fields.length) + 1;
    const field = FieldFactory.create(payload, {
      fieldId: `f${seq}`,
      order: before.fields.length + 1,
      existingApiNames: before.fields.map((f) => f.apiName),
    });

    const after = await this.objectRepository.updateByObjectId(objectId, {
      $push: { fields: field },
      $set: {
        fieldSeq: seq,
        updatedBy: actor.userId,
        ...(before.primaryDisplayFieldId ? {} : { primaryDisplayFieldId: field.fieldId }),
      },
    });
    await this.versionService.recordChange(before, after, { userId: actor.userId });

    this.eventBus.publish(EVENT_TYPE.FIELD_CREATED, { objectId, objectLabel: after.label, field, actor });
    if (field.indexed) this.#announceIndexable(after, field, actor);
    return field;
  }

  async patch(objectId, fieldId, payload, actor) {
    const before = await this.#require(objectId);
    objectStateFactory.for(before).assertCanEditSchema(before);

    const current = before.fields.find((f) => f.fieldId === fieldId);
    if (!current) throw new NotFoundError('Field', fieldId);

    if (payload.type && payload.type !== current.type) {
      const recordCount = await this.recordRepository.countByObject(objectId);
      if (recordCount) {
        throw new ConflictError(`Cannot change the type of '${current.label}': ${recordCount} record(s) already store values`);
      }
    }
    if ((payload.type || current.type) === FIELD_TYPE.LOOKUP && payload.lookup) {
      await this.lookupGuard.assertValidTarget({ ...current.lookup, ...payload.lookup });
      await this.lookupGuard.assertNoCycle(objectId, payload.lookup.objectId || current.lookup.objectId);
    }

    const next = FieldFactory.applyPatch(current, payload);
    const saved = await this.objectRepository.updateField(objectId, fieldId, next, actor.userId);
    await this.versionService.recordChange(before, saved, { userId: actor.userId });

    this.eventBus.publish(EVENT_TYPE.FIELD_UPDATED, { objectId, objectLabel: saved.label, field: next, actor });
    const becameIndexable = next.indexed && !current.indexed;
    if (becameIndexable) this.#announceIndexable(saved, next, actor);
    return next;
  }

  async remove(objectId, fieldId, actor) {
    const before = await this.#require(objectId);
    objectStateFactory.for(before).assertCanEditSchema(before);

    const field = before.fields.find((f) => f.fieldId === fieldId);
    if (!field) throw new NotFoundError('Field', fieldId);
    if (before.primaryDisplayFieldId === fieldId) {
      throw new ConflictError(`'${field.label}' is the primary display field of ${before.label}`);
    }
    await this.lookupGuard.assertNotUsedAsDisplayField(objectId, fieldId);

    const after = await this.objectRepository.updateByObjectId(objectId, {
      $pull: { fields: { fieldId } },
      $set: { updatedBy: actor.userId },
    });
    await this.versionService.recordChange(before, after, { userId: actor.userId });
    this.eventBus.publish(EVENT_TYPE.FIELD_DELETED, { objectId, objectLabel: after.label, fieldId, field, actor });
    return { fieldId, deleted: true };
  }

  async reorder(objectId, order, actor) {
    const before = await this.#require(objectId);
    const known = new Set(before.fields.map((f) => f.fieldId));
    const unknown = order.filter((id) => !known.has(id));
    if (unknown.length) throw new NotFoundError('Field', unknown.join(', '));

    const position = new Map(order.map((id, i) => [id, i + 1]));
    const fields = before.fields
      .map((f) => ({ ...f, order: position.get(f.fieldId) ?? known.size + 1 }))
      .sort((a, b) => a.order - b.order);

    const after = await this.objectRepository.updateByObjectId(objectId, {
      $set: { fields, updatedBy: actor.userId },
    });
    await this.versionService.recordChange(before, after, { userId: actor.userId, summary: 'Fields reordered' });
    this.eventBus.publish(EVENT_TYPE.FIELD_REORDERED, { objectId, objectLabel: after.label, order, actor });
    return fields;
  }

  /** The one place that asks the platform for an index — by announcing, not calling. */
  #announceIndexable(objectDef, field, actor) {
    this.eventBus.publish(EVENT_TYPE.FIELD_SEARCHABLE_ENABLED, {
      objectId: objectDef.objectId,
      objectLabel: objectDef.label,
      fieldId: field.fieldId,
      fieldLabel: field.label,
      indexType: fieldTypeRegistry.indexTypeFor(field.type),
      actor,
    });
  }
}
