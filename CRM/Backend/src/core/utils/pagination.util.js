import { PAGINATION } from '../../config/constants.js';

export function parsePagination(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const rawLimit = Number.parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, rawLimit), PAGINATION.MAX_LIMIT);
  return { page, limit, skip: (page - 1) * limit };
}

export const buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

/** Page an already-materialised array (used by index-served search results). */
export const slicePage = (items, page, limit) => items.slice((page - 1) * limit, page * limit);
