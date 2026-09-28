/** Object-level permission bits — stored as booleans, cumulative in practice. */
export const OBJECT_PERMISSION = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const OBJECT_PERMISSION_LIST = [
  { key: OBJECT_PERMISSION.READ, label: 'Read' },
  { key: OBJECT_PERMISSION.CREATE, label: 'Create' },
  { key: OBJECT_PERMISSION.UPDATE, label: 'Update' },
  { key: OBJECT_PERMISSION.DELETE, label: 'Delete' },
];

export const PERMISSION_LEVEL = {
  NONE: 'NONE',
  READ: 'READ',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

export const FIELD_ACCESS = {
  HIDDEN: 'HIDDEN',
  READ: 'READ',
  WRITE: 'WRITE',
};

export const FIELD_ACCESS_LIST = [FIELD_ACCESS.HIDDEN, FIELD_ACCESS.READ, FIELD_ACCESS.WRITE];

export const FIELD_ACCESS_TONE = {
  HIDDEN: 'slate',
  READ: 'sky',
  WRITE: 'emerald',
};
