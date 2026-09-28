import { IIndexStrategy } from '../../../core/interfaces/index-strategy.interface.js';
import { INDEX_TYPE, OPERATOR } from '../../../config/constants.js';
import { EMPTY_KEY } from '../../field/types/field-type.base.js';

/**
 * BTreeIndexStrategy — a sorted key array + binary search.
 *
 * A real B+Tree buys you page-friendly disk layout; in memory the observable
 * behaviour (O(log n) seek, ordered range scan, ordered iteration for sort
 * pushdown) is identical, which is the property the query planner depends on.
 */
export class BTreeIndexStrategy extends IIndexStrategy {
  constructor({ numeric = false } = {}) {
    super();
    this.numeric = numeric;
    this.map = new Map(); // key -> Set<recordId>
    this.sortedKeys = [];
    this.emptyIds = new Set();
    this.dirty = false;
  }

  get type() {
    return INDEX_TYPE.BTREE;
  }

  get operators() {
    return [
      OPERATOR.eq,
      OPERATOR.neq,
      OPERATOR.gt,
      OPERATOR.gte,
      OPERATOR.lt,
      OPERATOR.lte,
      OPERATOR.between,
      OPERATOR.in,
      OPERATOR.isEmpty,
      OPERATOR.isNotEmpty,
    ];
  }

  #cmp = (a, b) => {
    if (this.numeric) return Number(a) - Number(b);
    return a < b ? -1 : a > b ? 1 : 0;
  };

  build(pairs) {
    this.map.clear();
    this.emptyIds.clear();
    for (const { keys, recordId } of pairs) {
      for (const key of keys) this.#add(key, recordId);
    }
    this.#reindex();
    return this;
  }

  #add(key, recordId) {
    if (key === EMPTY_KEY) {
      this.emptyIds.add(recordId);
      return;
    }
    let bucket = this.map.get(key);
    if (!bucket) {
      bucket = new Set();
      this.map.set(key, bucket);
      this.dirty = true;
    }
    bucket.add(recordId);
  }

  #reindex() {
    this.sortedKeys = [...this.map.keys()].sort(this.#cmp);
    this.dirty = false;
  }

  #keys() {
    if (this.dirty) this.#reindex();
    return this.sortedKeys;
  }

  insert(key, recordId) {
    this.#add(String(key), recordId);
  }

  remove(key, recordId) {
    const k = String(key);
    if (k === EMPTY_KEY) {
      this.emptyIds.delete(recordId);
      return;
    }
    const bucket = this.map.get(k);
    if (!bucket) return;
    bucket.delete(recordId);
    if (!bucket.size) {
      this.map.delete(k);
      this.dirty = true;
    }
  }

  /** First position where keys[pos] >= target. */
  #lowerBound(target) {
    const keys = this.#keys();
    let lo = 0;
    let hi = keys.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.#cmp(keys[mid], target) < 0) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /** First position where keys[pos] > target. */
  #upperBound(target) {
    const keys = this.#keys();
    let lo = 0;
    let hi = keys.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.#cmp(keys[mid], target) <= 0) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  #collect(from, to) {
    const keys = this.#keys();
    const out = new Set();
    for (let i = Math.max(0, from); i < Math.min(keys.length, to); i += 1) {
      for (const id of this.map.get(keys[i])) out.add(id);
    }
    return out;
  }

  query(operator, value) {
    const keys = this.#keys();
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
      case OPERATOR.gt:
        return this.#collect(this.#upperBound(String(value)), keys.length);
      case OPERATOR.gte:
        return this.#collect(this.#lowerBound(String(value)), keys.length);
      case OPERATOR.lt:
        return this.#collect(0, this.#lowerBound(String(value)));
      case OPERATOR.lte:
        return this.#collect(0, this.#upperBound(String(value)));
      case OPERATOR.between: {
        const [lo, hi] = Array.isArray(value) ? value : [value, value];
        return this.#collect(this.#lowerBound(String(lo)), this.#upperBound(String(hi)));
      }
      case OPERATOR.isEmpty:
        return new Set(this.emptyIds);
      case OPERATOR.isNotEmpty:
        return this.#collect(0, keys.length);
      case OPERATOR.neq: {
        const out = this.#collect(0, keys.length);
        for (const id of this.map.get(String(value)) || []) out.delete(id);
        for (const id of this.emptyIds) out.add(id);
        return out;
      }
      default:
        return null;
    }
  }

  /** Sort pushdown: the tree already holds the ordering, so no comparison sort is needed. */
  sortedRecordIds(order = 'asc') {
    const keys = this.#keys();
    const iterate = order === 'desc' ? [...keys].reverse() : keys;
    const out = [];
    for (const key of iterate) for (const id of this.map.get(key)) out.push(id);
    for (const id of this.emptyIds) out.push(id);
    return out;
  }

  cardinality() {
    return this.map.size;
  }

  stats() {
    let postings = this.emptyIds.size;
    for (const ids of this.map.values()) postings += ids.size;
    return { keys: this.map.size, postings };
  }

  serialize() {
    const rows = [...this.map.entries()].map(([key, ids]) => ({ key, recordIds: [...ids] }));
    if (this.emptyIds.size) rows.push({ key: EMPTY_KEY, recordIds: [...this.emptyIds] });
    return rows;
  }

  load(rows) {
    this.map.clear();
    this.emptyIds.clear();
    for (const row of rows) {
      if (row.key === EMPTY_KEY) this.emptyIds = new Set(row.recordIds);
      else this.map.set(row.key, new Set(row.recordIds));
    }
    this.#reindex();
    return this;
  }
}
