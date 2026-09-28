import { EVENT_TYPE, AUDIT_ACTION } from '../../../config/constants.js';

/**
 * Audit writer.
 *
 * The only place that turns an event into an audit row. The mapping table below
 * is the whole subscriber — adding an audited event is one entry, and no
 * business service learns that auditing exists.
 */
const MAP = [
  [EVENT_TYPE.OBJECT_CREATED, AUDIT_ACTION.CREATED, (p) => `Object '${p.objectLabel}' created`],
  [EVENT_TYPE.OBJECT_UPDATED, AUDIT_ACTION.UPDATED, (p) => `Object '${p.objectLabel}' updated`],
  [EVENT_TYPE.OBJECT_PUBLISHED, AUDIT_ACTION.PUBLISHED, (p) => `Object '${p.objectLabel}' published`],
  [EVENT_TYPE.OBJECT_ARCHIVED, AUDIT_ACTION.ARCHIVED, (p) => (p.deleted ? `Object '${p.objectLabel}' deleted` : `Object '${p.objectLabel}' archived`)],
  [EVENT_TYPE.OBJECT_CLONED, AUDIT_ACTION.CLONED, (p) => `Cloned from '${p.sourceObjectId}' (${p.recordsCopied} records)`],
  [EVENT_TYPE.FIELD_CREATED, AUDIT_ACTION.CREATED, (p) => `Field '${p.field.label}' (${p.field.type}) added`],
  [EVENT_TYPE.FIELD_UPDATED, AUDIT_ACTION.UPDATED, (p) => `Field '${p.field.label}' updated`],
  [EVENT_TYPE.FIELD_DELETED, AUDIT_ACTION.DELETED, (p) => `Field '${p.field?.label || p.fieldId}' deleted`],
  [EVENT_TYPE.FIELD_REORDERED, AUDIT_ACTION.UPDATED, () => 'Fields reordered'],
  [EVENT_TYPE.RECORD_CREATED, AUDIT_ACTION.CREATED, (p) => `${p.objectLabel} '${p.displayName}' created`],
  [EVENT_TYPE.RECORD_UPDATED, AUDIT_ACTION.UPDATED, (p) => `${p.objectLabel} '${p.displayName}' updated`],
  [EVENT_TYPE.RECORD_ARCHIVED, AUDIT_ACTION.ARCHIVED, (p) => `${p.objectLabel} '${p.displayName}' archived`],
  [EVENT_TYPE.RECORD_RESTORED, AUDIT_ACTION.RESTORED, (p) => `${p.objectLabel} '${p.displayName}' restored`],
  [EVENT_TYPE.RECORD_BULK, AUDIT_ACTION.BULK_UPDATED, (p) => `Bulk ${p.action}: ${p.succeeded} succeeded, ${p.failed} failed`],
  [EVENT_TYPE.INDEX_BUILD_COMPLETED, AUDIT_ACTION.INDEX_BUILT, (p) => `Index built: ${p.docCount} docs in ${p.buildMs}ms`],
];

export function registerAuditSubscriber({ eventBus, auditService }) {
  for (const [type, action, summarise] of MAP) {
    eventBus.subscribe(type, ({ payload }) =>
      auditService.write({
        action: payload.source === 'IMPORT' ? 'IMPORTED' : action,
        objectId: payload.objectId,
        objectLabel: payload.objectLabel,
        recordId: payload.recordId || null,
        recordDisplayName: payload.displayName || '',
        userId: payload.actor?.userId,
        summary: summarise(payload),
        before: payload.before,
        after: payload.after,
      }),
    );
  }
}
