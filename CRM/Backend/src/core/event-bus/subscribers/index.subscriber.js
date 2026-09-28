import { EVENT_TYPE } from '../../../config/constants.js';
import { logger } from '../../utils/logger.util.js';

/**
 * Index maintenance subscriber.
 *
 * This is the piece chat.md argues for: no service ever calls the index layer.
 * Records publish what happened; the index reacts. Marking a field searchable
 * needs no admin "build" step — the event does it.
 */
export function registerIndexSubscriber({ eventBus, indexManager }) {
  const onRecordWrite = async ({ payload }) => {
    await indexManager.applyRecordChange({
      objectId: payload.objectId,
      recordId: payload.recordId,
      before: payload.before || null,
      after: payload.after || null,
    });
  };

  eventBus.subscribe(EVENT_TYPE.RECORD_CREATED, onRecordWrite);
  eventBus.subscribe(EVENT_TYPE.RECORD_UPDATED, onRecordWrite);
  eventBus.subscribe(EVENT_TYPE.RECORD_ARCHIVED, ({ payload }) =>
    indexManager.applyRecordChange({
      objectId: payload.objectId,
      recordId: payload.recordId,
      before: payload.before || null,
      after: null,
    }),
  );
  eventBus.subscribe(EVENT_TYPE.RECORD_RESTORED, ({ payload }) =>
    indexManager.applyRecordChange({
      objectId: payload.objectId,
      recordId: payload.recordId,
      before: null,
      after: payload.after || null,
    }),
  );

  eventBus.subscribe(EVENT_TYPE.FIELD_SEARCHABLE_ENABLED, async ({ payload }) => {
    const def = await indexManager.ensureIndex(payload.objectId, payload.fieldId);
    await indexManager.build(def.indexId);
    logger.info(`Auto-built ${payload.indexType} index for ${payload.objectId}.${payload.fieldLabel}`, null, 'index');
  });

  eventBus.subscribe(EVENT_TYPE.FIELD_DELETED, async ({ payload }) => {
    const entry = indexManager.getIndexFor(payload.objectId, payload.fieldId);
    if (entry) await indexManager.drop(entry.def.indexId);
  });

  eventBus.subscribe(EVENT_TYPE.OBJECT_PUBLISHED, async ({ payload }) => {
    await indexManager.buildForObject(payload.objectId);
  });
}
