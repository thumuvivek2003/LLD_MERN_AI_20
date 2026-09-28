export const FIELD_TYPE = {
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
};

export const FIELD_TYPE_LIST = Object.values(FIELD_TYPE);

/** Colour used for the picklist option swatches offered in the Add Field wizard. */
export const OPTION_COLORS = ['emerald', 'amber', 'rose', 'indigo', 'sky', 'violet', 'slate'];

export const LOOKUP_ON_DELETE = {
  RESTRICT: 'RESTRICT',
  CASCADE: 'CASCADE',
  SET_NULL: 'SET_NULL',
};
