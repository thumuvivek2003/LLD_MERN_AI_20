export const EVENT_TYPE = {
  OBJECT_CREATED: 'object.created',
  OBJECT_UPDATED: 'object.updated',
  OBJECT_PUBLISHED: 'object.published',
  OBJECT_ARCHIVED: 'object.archived',
  OBJECT_CLONED: 'object.cloned',
  FIELD_CREATED: 'field.created',
  FIELD_UPDATED: 'field.updated',
  FIELD_DELETED: 'field.deleted',
  FIELD_REORDERED: 'field.reordered',
  FIELD_SEARCHABLE_ENABLED: 'field.searchable.enabled',
  RECORD_CREATED: 'record.created',
  RECORD_UPDATED: 'record.updated',
  RECORD_ARCHIVED: 'record.archived',
  RECORD_RESTORED: 'record.restored',
  RECORD_BULK: 'record.bulk',
  INDEX_BUILD_STARTED: 'index.build.started',
  INDEX_BUILD_COMPLETED: 'index.build.completed',
  INDEX_ENTRY_UPDATED: 'index.entry.updated',
  INDEX_DELETED: 'index.deleted',
  LOOKUP_RESOLVED: 'lookup.resolved',
  LOOKUP_FAILED: 'lookup.failed',
  VALIDATION_FAILED: 'validation.failed',
  CACHE_INVALIDATED: 'cache.invalidated',
};

export const EVENT_TYPE_LIST = Object.values(EVENT_TYPE);

/** Event families used to colour the Event Monitor stream. */
export const EVENT_FAMILY_TONE = {
  object: 'indigo',
  field: 'violet',
  record: 'emerald',
  index: 'sky',
  lookup: 'amber',
  validation: 'rose',
  cache: 'slate',
};
