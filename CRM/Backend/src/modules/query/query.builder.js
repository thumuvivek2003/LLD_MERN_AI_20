import { FILTER_LOGIC, PAGINATION } from '../../config/constants.js';

/**
 * Builder for a normalised query spec.
 *
 * The REST layer, saved views and the record list endpoint all want to run a
 * search but describe it differently; each of them assembles the same spec
 * through this builder instead of hand-rolling an object literal.
 */
export class QueryBuilder {
  constructor(objectId) {
    this.spec = {
      objectId,
      filters: [],
      logic: FILTER_LOGIC.AND,
      sort: null,
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      columns: null,
      status: 'ACTIVE',
    };
  }

  static for(objectId) {
    return new QueryBuilder(objectId);
  }

  where(fieldId, operator, value) {
    this.spec.filters.push({ fieldId, operator, value });
    return this;
  }

  withFilters(filters = []) {
    for (const f of filters) if (f?.fieldId && f?.operator) this.spec.filters.push(f);
    return this;
  }

  withLogic(logic) {
    if (logic === FILTER_LOGIC.OR || logic === FILTER_LOGIC.AND) this.spec.logic = logic;
    return this;
  }

  sortBy(fieldId, order = 'asc') {
    if (fieldId) this.spec.sort = { fieldId, order: order === 'desc' ? 'desc' : 'asc' };
    return this;
  }

  paginate(page, limit) {
    if (page) this.spec.page = Math.max(1, Number(page));
    if (limit) this.spec.limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, Number(limit)));
    return this;
  }

  select(columns) {
    if (Array.isArray(columns) && columns.length) this.spec.columns = columns;
    return this;
  }

  withStatus(status) {
    if (status) this.spec.status = status;
    return this;
  }

  build() {
    return { ...this.spec, filters: [...this.spec.filters] };
  }
}
