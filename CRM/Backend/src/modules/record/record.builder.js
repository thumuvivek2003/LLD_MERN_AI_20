import { fieldTypeRegistry } from '../field/types/field-type.registry.js';
import { recordId as newRecordId } from '../../core/utils/id.util.js';
import { RECORD_STATUS } from '../../config/constants.js';

/**
 * Record Builder.
 *
 * Assembling a record needs six inputs (metadata, raw input, an existing record
 * for partial merges, the actor, the object version, defaults) and produces one
 * consistent artefact. A constructor with six arguments would be unreadable and
 * every caller would have to remember the coercion step; the builder makes the
 * order explicit and the coercion unavoidable.
 *
 *   RecordBuilder.for(objectDef).asActor(a).fromExisting(r).withInput(json).build()
 */
export class RecordBuilder {
  constructor(objectDef) {
    this.objectDef = objectDef;
    this.existing = null;
    this.input = {};
    this.actor = { userId: 'u_system' };
    this.touched = new Set();
  }

  static for(objectDef) {
    return new RecordBuilder(objectDef);
  }

  asActor(actor) {
    this.actor = actor || this.actor;
    return this;
  }

  fromExisting(record) {
    this.existing = record;
    return this;
  }

  withInput(recordJson = {}) {
    this.input = recordJson || {};
    this.touched = new Set(Object.keys(this.input));
    return this;
  }

  get isCreate() {
    return !this.existing;
  }

  /**
   * @returns {{recordJson, displayName, touched, errors, doc}}
   * `errors` holds type-coercion failures in VALIDATION_ERROR detail shape —
   * they are reported alongside rule failures so the UI shows one list.
   */
  build() {
    const base = this.existing?.recordJson ? { ...this.existing.recordJson } : {};
    const errors = [];
    const recordJson = {};

    for (const field of this.objectDef.fields) {
      const descriptor = fieldTypeRegistry.get(field.type);
      let raw;

      if (Object.hasOwn(this.input, field.fieldId)) raw = this.input[field.fieldId];
      else if (Object.hasOwn(base, field.fieldId)) raw = base[field.fieldId];
      else raw = this.isCreate ? field.defaultValue : undefined;

      if (raw === undefined) continue;

      const coerced = descriptor.coerce(raw);
      if (!coerced.ok) {
        errors.push({ fieldId: field.fieldId, apiName: field.apiName, rule: 'TYPE', message: `${field.label}: ${coerced.message}` });
        continue;
      }
      recordJson[field.fieldId] = coerced.value;
    }

    const displayName = this.#displayName(recordJson);
    const now = new Date();

    const doc = this.isCreate
      ? {
          recordId: newRecordId(),
          objectId: this.objectDef.objectId,
          recordJson,
          displayName,
          status: RECORD_STATUS.ACTIVE,
          objectVersion: this.objectDef.version,
          createdBy: this.actor.userId,
          updatedBy: this.actor.userId,
          createdAt: now,
          updatedAt: now,
        }
      : {
          ...this.existing,
          recordJson,
          displayName,
          objectVersion: this.objectDef.version,
          updatedBy: this.actor.userId,
          updatedAt: now,
        };

    return { recordJson, displayName, touched: this.touched, errors, doc };
  }

  #displayName(recordJson) {
    const fieldId = this.objectDef.primaryDisplayFieldId || this.objectDef.fields[0]?.fieldId;
    if (!fieldId) return '';
    const field = this.objectDef.fields.find((f) => f.fieldId === fieldId);
    if (!field) return '';
    const value = fieldTypeRegistry.get(field.type).display(recordJson[fieldId]);
    return value || `${this.objectDef.label} record`;
  }
}
