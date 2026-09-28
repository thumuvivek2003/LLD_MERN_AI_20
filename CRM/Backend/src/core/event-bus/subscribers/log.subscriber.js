import { EVENT_TYPE } from '../../../config/constants.js';
import { logger } from '../../utils/logger.util.js';

/**
 * Application log writer. Deliberately selective: logging every record write
 * would drown the operator, so only lifecycle, index and failure events are
 * promoted to the log stream that `/system/logs` serves.
 */
const NOTABLE = {
  [EVENT_TYPE.OBJECT_CREATED]: ['info', (p) => `Object created: ${p.objectLabel}`],
  [EVENT_TYPE.OBJECT_PUBLISHED]: ['info', (p) => `Object published: ${p.objectLabel}`],
  [EVENT_TYPE.OBJECT_ARCHIVED]: ['warn', (p) => `Object archived: ${p.objectLabel}`],
  [EVENT_TYPE.OBJECT_CLONED]: ['info', (p) => `Object cloned: ${p.sourceObjectId} → ${p.objectId}`],
  [EVENT_TYPE.FIELD_SEARCHABLE_ENABLED]: ['info', (p) => `Index requested for ${p.objectId}.${p.fieldLabel}`],
  [EVENT_TYPE.INDEX_BUILD_STARTED]: ['info', (p) => `Index build started: ${p.indexId}`],
  [EVENT_TYPE.INDEX_BUILD_COMPLETED]: ['info', (p) => `Index build completed: ${p.docCount} docs in ${p.buildMs}ms`],
  [EVENT_TYPE.INDEX_DELETED]: ['warn', (p) => `Index deleted: ${p.indexId}`],
  [EVENT_TYPE.VALIDATION_FAILED]: ['warn', (p) => `Validation failed on ${p.objectLabel}: ${p.errors.map((e) => e.rule).join(', ')}`],
  [EVENT_TYPE.LOOKUP_FAILED]: ['error', (p) => `Lookup resolution failed: ${p.objectId}.${p.fieldId} → ${p.targetId}`],
  [EVENT_TYPE.RECORD_BULK]: ['info', (p) => `Bulk ${p.action} on ${p.objectLabel}: ${p.succeeded}/${p.processed} succeeded`],
};

export function registerLogSubscriber({ eventBus }) {
  for (const [type, [level, format]] of Object.entries(NOTABLE)) {
    eventBus.subscribe(type, ({ payload }) => logger[level](format(payload), null, 'engine'));
  }
}
