import { ObjectMapper } from './object.mapper.js';
import { objectStateFactory } from './states/object-state.factory.js';
import { FieldFactory } from '../field/field.factory.js';
import { OBJECT_STATUS, EVENT_TYPE, RECORD_STATUS } from '../../config/constants.js';
import { slugify, camelCase } from '../../core/utils/slug.util.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { ConflictError } from '../../core/exceptions/conflict.error.js';
import { recordId as newRecordId } from '../../core/utils/id.util.js';

/**
 * Object Engine — the aggregate root of the metadata model.
 *
 * Lifecycle rules are delegated to the State classes; versioning to
 * ObjectVersionService; indexing and auditing to event subscribers. What is
 * left here is genuinely about object identity and shape.
 */
export class ObjectService {
  constructor({ objectRepository, recordRepository, indexRepository, metadataCache, versionService, eventBus }) {
    this.objectRepository = objectRepository;
    this.recordRepository = recordRepository;
    this.indexRepository = indexRepository;
    this.metadataCache = metadataCache;
    this.versionService = versionService;
    this.eventBus = eventBus;
  }

  async #recordCounts() {
    const rows = await this.recordRepository.groupCountByObject();
    return new Map(rows.map((r) => [r._id, r.count]));
  }

  async #require(objectId) {
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);
    return objectDef;
  }

  // ------------------------------------------------------------------ reads

  async list({ q, status, sort, order, page, limit, skip }) {
    const [docs, total] = await this.objectRepository.search({ q, status, sort, order, skip, limit });
    const counts = await this.#recordCounts();
    return { items: docs.map((d) => ObjectMapper.toListItem(d, counts.get(d.objectId) || 0)), total, page, limit };
  }

  async get(objectId) {
    const objectDef = await this.#require(objectId);
    const recordCount = await this.recordRepository.countByObject(objectId);
    return ObjectMapper.toDetail(objectDef, { recordCount });
  }

  async stats(objectId) {
    await this.#require(objectId);
    const [recordCount, activeCount, archivedCount, indexes, last] = await Promise.all([
      this.recordRepository.countByObject(objectId),
      this.recordRepository.countByObject(objectId, RECORD_STATUS.ACTIVE),
      this.recordRepository.countByObject(objectId, RECORD_STATUS.ARCHIVED),
      this.indexRepository.findAll({ objectId }),
      this.recordRepository.lastActivityAt(objectId),
    ]);
    return { recordCount, activeCount, archivedCount, indexCount: indexes.length, lastActivityAt: last?.updatedAt || null };
  }

  versions(objectId) {
    return this.versionService.list(objectId);
  }

  // ----------------------------------------------------------------- writes

  async create(payload, actor) {
    const objectId = slugify(payload.apiName || payload.label);
    if (!objectId) throw new ConflictError('Could not derive an objectId from the supplied label');
    if (await this.objectRepository.findByObjectId(objectId)) {
      throw new ConflictError(`An object with id '${objectId}' already exists`);
    }

    let seq = 0;
    const fields = (payload.fields || []).map((f) => {
      seq += 1;
      return FieldFactory.create(f, { fieldId: `f${seq}`, order: seq, existingApiNames: [] });
    });

    const doc = await this.objectRepository.create({
      objectId,
      label: payload.label,
      pluralLabel: payload.pluralLabel || `${payload.label}s`,
      apiName: camelCase(payload.apiName || payload.label),
      description: payload.description || '',
      icon: payload.icon || 'box',
      color: payload.color || 'indigo',
      status: OBJECT_STATUS.DRAFT,
      version: 1,
      primaryDisplayFieldId: fields[0]?.fieldId || null,
      fields,
      fieldSeq: seq,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    const created = doc.toObject();
    await this.versionService.seedInitial(created, actor.userId);
    this.eventBus.publish(EVENT_TYPE.OBJECT_CREATED, { objectId, objectLabel: created.label, actor });
    return ObjectMapper.toDetail(created, { recordCount: 0 });
  }

  async patch(objectId, payload, actor) {
    const before = await this.#require(objectId);
    const update = { updatedBy: actor.userId };
    for (const prop of ['label', 'pluralLabel', 'description', 'icon', 'color', 'primaryDisplayFieldId']) {
      if (payload[prop] !== undefined) update[prop] = payload[prop];
    }
    if (update.primaryDisplayFieldId && !before.fields.some((f) => f.fieldId === update.primaryDisplayFieldId)) {
      throw new NotFoundError('Field', update.primaryDisplayFieldId);
    }

    const after = await this.objectRepository.updateByObjectId(objectId, { $set: update });
    after.version = await this.versionService.recordChange(before, after, { userId: actor.userId });
    this.eventBus.publish(EVENT_TYPE.OBJECT_UPDATED, { objectId, objectLabel: after.label, actor, changes: update });
    return ObjectMapper.toDetail(after, { recordCount: await this.recordRepository.countByObject(objectId) });
  }

  async transition(objectId, target, actor) {
    const before = await this.#require(objectId);
    objectStateFactory.for(before).assertTransition(target);

    const after = await this.objectRepository.updateByObjectId(objectId, {
      $set: { status: target, updatedBy: actor.userId },
    });
    after.version = await this.versionService.recordChange(before, after, {
      userId: actor.userId,
      summary: `Status ${before.status} → ${target}`,
    });

    const eventType = {
      [OBJECT_STATUS.PUBLISHED]: EVENT_TYPE.OBJECT_PUBLISHED,
      [OBJECT_STATUS.ARCHIVED]: EVENT_TYPE.OBJECT_ARCHIVED,
    }[target] || EVENT_TYPE.OBJECT_UPDATED;
    this.eventBus.publish(eventType, { objectId, objectLabel: after.label, from: before.status, to: target, actor });

    return ObjectMapper.toDetail(after, { recordCount: await this.recordRepository.countByObject(objectId) });
  }

  async clone(objectId, payload, actor) {
    const source = await this.#require(objectId);
    const newObjectId = slugify(payload.apiName || payload.label);
    if (await this.objectRepository.findByObjectId(newObjectId)) {
      throw new ConflictError(`An object with id '${newObjectId}' already exists`);
    }

    const doc = await this.objectRepository.create({
      ...source,
      _id: undefined,
      objectId: newObjectId,
      label: payload.label,
      pluralLabel: payload.pluralLabel || `${payload.label}s`,
      apiName: camelCase(payload.apiName || payload.label),
      status: OBJECT_STATUS.DRAFT,
      version: 1,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });
    const clone = doc.toObject();
    await this.versionService.seedInitial(clone, actor.userId);

    let copied = 0;
    if (payload.includeRecords) {
      const rows = [];
      const cursor = this.recordRepository.cursorByObject(objectId, RECORD_STATUS.ACTIVE);
      for await (const record of cursor) {
        rows.push({
          recordId: newRecordId(),
          objectId: newObjectId,
          recordJson: record.recordJson,
          status: RECORD_STATUS.ACTIVE,
          objectVersion: 1,
          createdBy: actor.userId,
          updatedBy: actor.userId,
        });
      }
      if (rows.length) await this.recordRepository.insertMany(rows);
      copied = rows.length;
    }

    this.eventBus.publish(EVENT_TYPE.OBJECT_CLONED, {
      objectId: newObjectId,
      objectLabel: clone.label,
      sourceObjectId: objectId,
      recordsCopied: copied,
      actor,
    });
    return ObjectMapper.toDetail(clone, { recordCount: copied });
  }

  async remove(objectId, actor) {
    const objectDef = await this.#require(objectId);
    if (!objectStateFactory.for(objectDef).canDelete()) {
      throw new ConflictError(`A ${objectDef.status} object cannot be deleted`);
    }

    const recordCount = await this.recordRepository.countByObject(objectId);
    if (recordCount) throw new ConflictError(`'${objectDef.label}' still has ${recordCount} record(s)`);

    const referrers = await this.referencedBy(objectId);
    if (referrers.length) {
      const names = referrers.map((r) => `${r.objectLabel}.${r.fieldLabel}`).join(', ');
      throw new ConflictError(`'${objectDef.label}' is referenced by lookup field(s): ${names}`);
    }

    await this.objectRepository.deleteByObjectId(objectId);
    this.eventBus.publish(EVENT_TYPE.OBJECT_ARCHIVED, {
      objectId,
      objectLabel: objectDef.label,
      deleted: true,
      actor,
    });
    return { objectId, deleted: true };
  }

  /** Every lookup field on any object that points at `objectId`. */
  async referencedBy(objectId) {
    const all = await this.metadataCache.getAllObjects();
    const out = [];
    for (const obj of all) {
      if (obj.objectId === objectId) continue;
      for (const field of obj.fields || []) {
        if (field.lookup?.objectId === objectId) {
          out.push({
            objectId: obj.objectId,
            objectLabel: obj.label,
            icon: obj.icon,
            fieldId: field.fieldId,
            fieldLabel: field.label,
            onDelete: field.lookup.onDelete,
          });
        }
      }
    }
    return out;
  }
}
