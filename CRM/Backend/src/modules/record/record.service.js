import { RecordBuilder } from './record.builder.js';
import { RecordMapper } from './record.mapper.js';
import { FieldAccessMapper } from '../permission/field-access.mapper.js';
import { QueryBuilder } from '../query/query.builder.js';
import { objectStateFactory } from '../object/states/object-state.factory.js';
import { RECORD_STATUS, EVENT_TYPE, FIELD_TYPE, OPERATOR, FILTER_LOGIC } from '../../config/constants.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { ValidationError } from '../../core/exceptions/validation.error.js';
import { ConflictError } from '../../core/exceptions/conflict.error.js';

const SEARCHABLE_TEXT = new Set([FIELD_TYPE.TEXT, FIELD_TYPE.TEXTAREA, FIELD_TYPE.EMAIL, FIELD_TYPE.PHONE]);

/**
 * Record Engine — single-record lifecycle.
 * Bulk, import and export live in sibling services so this file stays about
 * one record at a time.
 */
export class RecordService {
  constructor({
    recordRepository,
    metadataCache,
    validationService,
    lookupResolver,
    cascadeService,
    permissionService,
    queryExecutor,
    auditRepository,
    eventBus,
  }) {
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.validationService = validationService;
    this.lookupResolver = lookupResolver;
    this.cascadeService = cascadeService;
    this.permissionService = permissionService;
    this.queryExecutor = queryExecutor;
    this.auditRepository = auditRepository;
    this.eventBus = eventBus;
  }

  async context(objectId, actor) {
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);
    const access = await this.permissionService.fieldAccess(actor.roleId, objectDef);
    return { objectDef, access, state: objectStateFactory.for(objectDef) };
  }

  // ------------------------------------------------------------------ reads

  async list(objectId, query, actor) {
    const { objectDef, access } = await this.context(objectId, actor);

    const builder = QueryBuilder.for(objectId)
      .paginate(query.page, query.limit)
      .sortBy(query.sort, query.order)
      .withStatus(query.status || RECORD_STATUS.ACTIVE);

    // A free-text `q` becomes an OR of `contains` over the TRIE-indexed fields.
    if (query.q) {
      const textFields = objectDef.fields.filter((f) => SEARCHABLE_TEXT.has(f.type) && f.indexed);
      builder.withLogic(FILTER_LOGIC.OR);
      for (const f of textFields) builder.where(f.fieldId, OPERATOR.contains, query.q);
    }

    const { records, total, plan } = await this.queryExecutor.execute(objectDef, builder.build());
    const resolvedByRecord = await this.lookupResolver.resolveMany(objectDef, records);
    return { items: RecordMapper.toList(records, { access, resolvedByRecord }), total, plan };
  }

  async get(objectId, recordId, actor) {
    const { objectDef, access } = await this.context(objectId, actor);
    const record = await this.recordRepository.findByRecordId(recordId);
    if (!record || record.objectId !== objectId) throw new NotFoundError('Record', recordId);
    const resolved = await this.lookupResolver.resolveOne(objectDef, record);
    return RecordMapper.toDto(record, { access, resolved });
  }

  async history(objectId, recordId, { skip, limit }) {
    const [items, total] = await this.auditRepository.query({ objectId, recordId, skip, limit });
    return { items, total };
  }

  // ----------------------------------------------------------------- writes

  async create(objectId, body, actor) {
    const { objectDef, access, state } = await this.context(objectId, actor);
    state.assertCanCreateRecords(objectDef);
    FieldAccessMapper.assertWritable(body.recordJson || {}, access, objectDef.fields);

    const built = RecordBuilder.for(objectDef).asActor(actor).withInput(body.recordJson).build();
    const errors = [
      ...built.errors,
      ...(await this.validationService.validateRecord({
        objectDef,
        recordJson: built.recordJson,
        isCreate: true,
        touched: built.touched,
      })),
    ];
    if (errors.length) throw new ValidationError(errors);

    await this.recordRepository.create(built.doc);
    this.eventBus.publish(EVENT_TYPE.RECORD_CREATED, {
      objectId,
      objectLabel: objectDef.label,
      recordId: built.doc.recordId,
      displayName: built.displayName,
      before: null,
      after: built.recordJson,
      actor,
    });
    return RecordMapper.toDto(built.doc, { access });
  }

  async update(objectId, recordId, body, actor) {
    const { objectDef, access, state } = await this.context(objectId, actor);
    state.assertCanEditRecords(objectDef);
    FieldAccessMapper.assertWritable(body.recordJson || {}, access, objectDef.fields);

    const existing = await this.recordRepository.findByRecordId(recordId);
    if (!existing || existing.objectId !== objectId) throw new NotFoundError('Record', recordId);
    if (existing.status === RECORD_STATUS.ARCHIVED) throw new ConflictError('Archived records must be restored before editing');

    const built = RecordBuilder.for(objectDef).asActor(actor).fromExisting(existing).withInput(body.recordJson).build();
    const errors = [
      ...built.errors,
      ...(await this.validationService.validateRecord({
        objectDef,
        recordJson: built.recordJson,
        recordId,
        isCreate: false,
        touched: built.touched,
      })),
    ];
    if (errors.length) throw new ValidationError(errors);

    const saved = await this.recordRepository.updateByRecordId(recordId, {
      $set: {
        recordJson: built.recordJson,
        displayName: built.displayName,
        objectVersion: objectDef.version,
        updatedBy: actor.userId,
      },
    });

    this.eventBus.publish(EVENT_TYPE.RECORD_UPDATED, {
      objectId,
      objectLabel: objectDef.label,
      recordId,
      displayName: built.displayName,
      before: existing.recordJson,
      after: built.recordJson,
      actor,
    });
    return RecordMapper.toDto(saved, { access });
  }

  async archive(objectId, recordId, actor) {
    const { objectDef, access } = await this.context(objectId, actor);
    const record = await this.recordRepository.findByRecordId(recordId);
    if (!record || record.objectId !== objectId) throw new NotFoundError('Record', recordId);
    if (record.status === RECORD_STATUS.ARCHIVED) return RecordMapper.toDto(record, { access });

    const cascade = await this.cascadeService.apply(objectDef, record, actor);

    const saved = await this.recordRepository.updateByRecordId(recordId, {
      $set: { status: RECORD_STATUS.ARCHIVED, updatedBy: actor.userId },
    });
    this.eventBus.publish(EVENT_TYPE.RECORD_ARCHIVED, {
      objectId,
      objectLabel: objectDef.label,
      recordId,
      displayName: record.displayName,
      before: record.recordJson,
      cascade,
      actor,
    });
    return { ...RecordMapper.toDto(saved, { access }), cascade };
  }

  async restore(objectId, recordId, actor) {
    const { objectDef, access, state } = await this.context(objectId, actor);
    state.assertCanEditRecords(objectDef);
    const record = await this.recordRepository.findByRecordId(recordId);
    if (!record || record.objectId !== objectId) throw new NotFoundError('Record', recordId);

    const saved = await this.recordRepository.updateByRecordId(recordId, {
      $set: { status: RECORD_STATUS.ACTIVE, updatedBy: actor.userId },
    });
    this.eventBus.publish(EVENT_TYPE.RECORD_RESTORED, {
      objectId,
      objectLabel: objectDef.label,
      recordId,
      displayName: record.displayName,
      after: record.recordJson,
      actor,
    });
    return RecordMapper.toDto(saved, { access });
  }
}
