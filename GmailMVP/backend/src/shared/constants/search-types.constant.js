/**
 * Supported search scopes for GET /api/search?type=
 */
export const SEARCH_TYPES = Object.freeze({
  ALL: 'all',
  FROM: 'from',
  TO: 'to',
  SUBJECT: 'subject',
  BODY: 'body',
});

export const SEARCH_TYPE_VALUES = Object.freeze(Object.values(SEARCH_TYPES));

export const isValidSearchType = (type) => SEARCH_TYPE_VALUES.includes(type);
