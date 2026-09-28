/**
 * Single source of truth for every enum in CONTRACT.md §3.
 * Frontend and backend must agree on these exact strings.
 */

export const OBJECT_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
});

export const RECORD_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
});

export const FIELD_TYPE = Object.freeze({
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  NUMBER: 'NUMBER',
  CURRENCY: 'CURRENCY',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  URL: 'URL',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
  BOOLEAN: 'BOOLEAN',
  PICKLIST: 'PICKLIST',
  MULTI_PICKLIST: 'MULTI_PICKLIST',
  LOOKUP: 'LOOKUP',
});

export const INDEX_TYPE = Object.freeze({
  HASH: 'HASH',
  BTREE: 'BTREE',
  TRIE: 'TRIE',
  GEO: 'GEO',
});

export const INDEX_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  BUILDING: 'BUILDING',
  FAILED: 'FAILED',
  INACTIVE: 'INACTIVE',
});

export const OPERATOR = Object.freeze({
  eq: 'eq',
  neq: 'neq',
  contains: 'contains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  in: 'in',
  between: 'between',
  isEmpty: 'isEmpty',
  isNotEmpty: 'isNotEmpty',
});

export const FILTER_LOGIC = Object.freeze({ AND: 'AND', OR: 'OR' });

export const FIELD_ACCESS = Object.freeze({ HIDDEN: 'HIDDEN', READ: 'READ', WRITE: 'WRITE' });

export const OBJECT_PERMISSION = Object.freeze(['read', 'create', 'update', 'delete']);

export const JOB_STATUS = Object.freeze({
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});

export const LOG_LEVEL = Object.freeze({
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
});

export const AUDIT_ACTION = Object.freeze({
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  ARCHIVED: 'ARCHIVED',
  RESTORED: 'RESTORED',
  PUBLISHED: 'PUBLISHED',
  CLONED: 'CLONED',
  DELETED: 'DELETED',
  INDEX_BUILT: 'INDEX_BUILT',
  BULK_UPDATED: 'BULK_UPDATED',
  IMPORTED: 'IMPORTED',
});

export const EVENT_TYPE = Object.freeze({
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
});

export const ROLE = Object.freeze({
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  BUSINESS_USER: 'BUSINESS_USER',
  SYSTEM: 'SYSTEM',
});

export const ON_DELETE = Object.freeze({
  RESTRICT: 'RESTRICT',
  CASCADE: 'CASCADE',
  SET_NULL: 'SET_NULL',
});

export const ERROR_CODE = Object.freeze({
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

export const OBJECT_COLORS = Object.freeze(['indigo', 'emerald', 'amber', 'rose', 'sky', 'violet']);

export const PAGINATION = Object.freeze({ DEFAULT_PAGE: 1, DEFAULT_LIMIT: 25, MAX_LIMIT: 200 });
