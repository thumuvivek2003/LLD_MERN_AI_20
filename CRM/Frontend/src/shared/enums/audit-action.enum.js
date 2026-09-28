export const AUDIT_ACTION = {
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
};

export const AUDIT_ACTION_LIST = Object.values(AUDIT_ACTION);

export const AUDIT_ACTION_LABEL = {
  CREATED: 'Created',
  UPDATED: 'Updated',
  ARCHIVED: 'Archived',
  RESTORED: 'Restored',
  PUBLISHED: 'Published',
  CLONED: 'Cloned',
  DELETED: 'Deleted',
  INDEX_BUILT: 'Built Index',
  BULK_UPDATED: 'Bulk Updated',
  IMPORTED: 'Imported',
};

export const AUDIT_ACTION_TONE = {
  CREATED: 'emerald',
  UPDATED: 'sky',
  ARCHIVED: 'slate',
  RESTORED: 'emerald',
  PUBLISHED: 'indigo',
  CLONED: 'violet',
  DELETED: 'rose',
  INDEX_BUILT: 'amber',
  BULK_UPDATED: 'sky',
  IMPORTED: 'violet',
};
