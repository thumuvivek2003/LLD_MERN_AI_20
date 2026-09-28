import { FILTER_LOGIC, OPERATOR, VALUELESS_OPERATORS } from '../../shared/enums/operator.enum.js';

/**
 * Builder pattern — the single composer of the `POST /search` body (CONTRACT §5.4).
 *
 *   SearchQueryBuilder.for('customer')
 *     .where('f3', 'eq', 'Hyderabad')
 *     .logic('AND')
 *     .sortBy('f1', 'asc')
 *     .paginate(1, 25)
 *     .columns(['f1','f2'])
 *     .build()
 *
 * Saved views round-trip through the same builder via `fromView` / `toView`,
 * so a view saved from the filter UI reloads into an identical query.
 */
export class SearchQueryBuilder {
  constructor(objectId) {
    this._objectId = objectId;
    this._filters = [];
    this._logic = FILTER_LOGIC.AND;
    this._sort = null;
    this._page = 1;
    this._limit = 25;
    this._columns = null;
  }

  static for(objectId) {
    return new SearchQueryBuilder(objectId);
  }

  /** Rehydrate from a saved view document (`{objectId, filters, logic, sort, columns}`). */
  static fromView(view = {}) {
    const builder = new SearchQueryBuilder(view.objectId);
    (view.filters || []).forEach((filter) =>
      builder.where(filter.fieldId, filter.operator, filter.value),
    );
    if (view.logic) builder.logic(view.logic);
    if (view.sort?.fieldId) builder.sortBy(view.sort.fieldId, view.sort.order);
    if (view.columns?.length) builder.columns(view.columns);
    return builder;
  }

  object(objectId) {
    this._objectId = objectId;
    return this;
  }

  where(fieldId, operator = OPERATOR.eq, value = '') {
    this._filters.push({ fieldId, operator, value });
    return this;
  }

  /** Replaces the whole filter set — used when the filter-row UI re-syncs. */
  filters(filters = []) {
    this._filters = filters.map((f) => ({ ...f }));
    return this;
  }

  logic(logic) {
    this._logic = logic === FILTER_LOGIC.OR ? FILTER_LOGIC.OR : FILTER_LOGIC.AND;
    return this;
  }

  sortBy(fieldId, order = 'asc') {
    this._sort = fieldId ? { fieldId, order: order === 'desc' ? 'desc' : 'asc' } : null;
    return this;
  }

  paginate(page = 1, limit = 25) {
    this._page = Math.max(1, Number(page) || 1);
    this._limit = Math.min(200, Math.max(1, Number(limit) || 25));
    return this;
  }

  columns(columns) {
    this._columns = columns?.length ? [...columns] : null;
    return this;
  }

  /** Drops rows the user started but never completed, so they don't reach the API. */
  usableFilters() {
    return this._filters.filter((filter) => isFilterComplete(filter));
  }

  build() {
    const query = {
      objectId: this._objectId,
      filters: this.usableFilters().map(normaliseFilter),
      logic: this._logic,
      page: this._page,
      limit: this._limit,
    };
    if (this._sort) query.sort = this._sort;
    if (this._columns) query.columns = this._columns;
    return query;
  }

  /** The persisted half of the query — the `POST /views` body minus name/isDefault. */
  toView() {
    return {
      objectId: this._objectId,
      filters: this.usableFilters().map(normaliseFilter),
      logic: this._logic,
      sort: this._sort,
      columns: this._columns || [],
    };
  }
}

export const isFilterComplete = (filter) => {
  if (!filter?.fieldId || !filter?.operator) return false;
  if (VALUELESS_OPERATORS.includes(filter.operator)) return true;
  if (filter.operator === OPERATOR.between) {
    return Array.isArray(filter.value) && filter.value.every((v) => v !== '' && v != null);
  }
  if (filter.operator === OPERATOR.in) {
    return Array.isArray(filter.value) && filter.value.length > 0;
  }
  return filter.value !== '' && filter.value !== null && filter.value !== undefined;
};

const normaliseFilter = (filter) => {
  if (VALUELESS_OPERATORS.includes(filter.operator)) {
    return { fieldId: filter.fieldId, operator: filter.operator };
  }
  return { fieldId: filter.fieldId, operator: filter.operator, value: filter.value };
};

/** A blank filter row seeded with the field's own default operator (from the registry). */
export const emptyFilterRow = (fieldId = '', operator = OPERATOR.eq, value = '') => ({
  id: `flt_${Math.random().toString(36).slice(2, 9)}`,
  fieldId,
  operator,
  value,
});

export default SearchQueryBuilder;
