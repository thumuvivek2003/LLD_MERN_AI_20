import { IIndexStrategy } from '../../../core/interfaces/index-strategy.interface.js';
import { INDEX_TYPE, OPERATOR } from '../../../config/constants.js';
import { EMPTY_KEY } from '../../field/types/field-type.base.js';

/**
 * HashIndexStrategy — Map<key, Set<recordId>>.
 * O(1) equality; the workhorse for picklists, booleans, emails and lookups.
 */
export class HashIndexStrategy extends IIndexStrategy {
  constructor() {
    super();
    this.map = new Map();
  }

  get type() {
    return INDEX_TYPE.HASH;
  }

  get operators() {
    return [OPERATOR.eq, OPERATOR.neq, OPERATOR.in, OPERATOR.isEmpty, OPERATOR.isNotEmpty];
  }

  build(pairs) {
    this.map.clear();
    for (const { keys, recordId } of pairs) {
      for (const key of keys) this.#add(key, recordId);
    }
    return this;
  }

  #add(key, recordId) {
    let bucket = this.map.get(key);
    if (!bucket) {
      bucket = new Set();
      this.map.set(key, bucket);
    }
    bucket.add(recordId);
  }

  insert(key, recordId) {
    this.#add(String(key), recordId);
  }

  remove(key, recordId) {
    const bucket = this.map.get(String(key));
    if (!bucket) return;
    bucket.delete(recordId);
    if (!bucket.size) this.map.delete(String(key));
  }

  query(operator, value) {
    switch (operator) {
      case OPERATOR.eq:
        return new Set(this.map.get(String(value)) || []);
      case OPERATOR.in: {
        const out = new Set();
        for (const v of Array.isArray(value) ? value : [value]) {
          for (const id of this.map.get(String(v)) || []) out.add(id);
        }
        return out;
      }
      case OPERATOR.isEmpty:
        return new Set(this.map.get(EMPTY_KEY) || []);
      case OPERATOR.neq:
        return this.#complementOf([String(value)]);
      case OPERATOR.isNotEmpty:
        return this.#complementOf([EMPTY_KEY]);
      default:
        return null;
    }
  }

  #complementOf(excludedKeys) {
    const excluded = new Set(excludedKeys);
    const out = new Set();
    for (const [key, ids] of this.map) {
      if (excluded.has(key)) continue;
      for (const id of ids) out.add(id);
    }
    return out;
  }

  cardinality() {
    return this.map.size;
  }

  stats() {
    let docs = 0;
    for (const ids of this.map.values()) docs += ids.size;
    return { keys: this.map.size, postings: docs };
  }

  serialize() {
    return [...this.map.entries()].map(([key, ids]) => ({ key, recordIds: [...ids] }));
  }

  load(rows) {
    this.map.clear();
    for (const row of rows) this.map.set(row.key, new Set(row.recordIds));
    return this;
  }
}
