import { NotImplementedError } from '../exceptions/not-implemented.error.js';

/**
 * IIndexStrategy — one data structure per implementation (Strategy).
 *
 * The IndexManager never asks "which type am I?"; it asks the strategy
 * `supports(operator)` and then `query(operator, value)`. Adding a GEO index
 * later means adding one file and one registry line.
 *
 * Persistence shape is normalised across strategies: `serialize()` returns
 * `[{ key, recordIds }]` rows stored in the `indexentries` collection, and
 * `load(rows)` rebuilds the in-memory structure from them.
 */
export class IIndexStrategy {
  get type() {
    throw new NotImplementedError('IIndexStrategy.type');
  }

  /** @returns {string[]} operator names this structure can answer natively */
  get operators() {
    throw new NotImplementedError('IIndexStrategy.operators');
  }

  supports(operator) {
    return this.operators.includes(operator);
  }

  /** Bulk build from `[{ recordId, value }]`. */
  build(_pairs) {
    throw new NotImplementedError('IIndexStrategy.build');
  }

  insert(_value, _recordId) {
    throw new NotImplementedError('IIndexStrategy.insert');
  }

  remove(_value, _recordId) {
    throw new NotImplementedError('IIndexStrategy.remove');
  }

  /** @returns {Set<string>} matching record ids */
  query(_operator, _value) {
    throw new NotImplementedError('IIndexStrategy.query');
  }

  /** Ordered record ids for sort pushdown; null when unsupported. */
  sortedRecordIds(_order) {
    return null;
  }

  suggest(_prefix, _limit) {
    return [];
  }

  /** Rough number of distinct keys — the optimizer's selectivity input. */
  cardinality() {
    throw new NotImplementedError('IIndexStrategy.cardinality');
  }

  stats() {
    throw new NotImplementedError('IIndexStrategy.stats');
  }

  serialize() {
    throw new NotImplementedError('IIndexStrategy.serialize');
  }

  load(_rows) {
    throw new NotImplementedError('IIndexStrategy.load');
  }
}
