import { IIndexStrategy } from '../../../core/interfaces/index-strategy.interface.js';
import { INDEX_TYPE, OPERATOR } from '../../../config/constants.js';
import { EMPTY_KEY } from '../../field/types/field-type.base.js';

const rawTokens = (value) => String(value).split(/[^a-zA-Z0-9@.]+/).filter(Boolean);
const tokenize = (value) => rawTokens(value).map((t) => t.toLowerCase());

class TrieNode {
  constructor() {
    this.children = new Map();
    this.values = new Set(); // full values that pass through / terminate here
  }
}

/**
 * TrieIndexStrategy — prefix tree for `startsWith`, plus an inverted token map
 * for `contains` / word search, over TEXT and TEXTAREA fields.
 *
 * `contains` and `endsWith` scan the *distinct token/value vocabulary*, not the
 * records: for 4 000 customers that is ~3 000 strings instead of 4 000 JSON
 * documents, and it stays flat as record count grows.
 */
export class TrieIndexStrategy extends IIndexStrategy {
  constructor({ maxPrefix = 24 } = {}) {
    super();
    this.maxPrefix = maxPrefix;
    this.root = new TrieNode();
    this.values = new Map(); // lowercased full value -> Set<recordId>
    this.originalCase = new Map(); // lowercased -> first seen original
    this.tokens = new Map(); // token -> Set<recordId>
    this.emptyIds = new Set();
  }

  get type() {
    return INDEX_TYPE.TRIE;
  }

  get operators() {
    return [
      OPERATOR.eq,
      OPERATOR.neq,
      OPERATOR.startsWith,
      OPERATOR.endsWith,
      OPERATOR.contains,
      OPERATOR.in,
      OPERATOR.isEmpty,
      OPERATOR.isNotEmpty,
    ];
  }

  build(pairs) {
    this.root = new TrieNode();
    this.values.clear();
    this.tokens.clear();
    this.originalCase.clear();
    this.emptyIds.clear();
    for (const { keys, recordId } of pairs) {
      for (const key of keys) this.insert(key, recordId);
    }
    return this;
  }

  insert(rawKey, recordId) {
    const key = String(rawKey);
    if (key === EMPTY_KEY) {
      this.emptyIds.add(recordId);
      return;
    }
    const lower = key.toLowerCase();
    if (!this.originalCase.has(lower)) this.originalCase.set(lower, key);

    let bucket = this.values.get(lower);
    if (!bucket) {
      bucket = new Set();
      this.values.set(lower, bucket);
      this.#insertPrefixPath(lower);
    }
    bucket.add(recordId);

    for (const raw of rawTokens(key)) {
      const token = raw.toLowerCase();
      if (!this.originalCase.has(token)) this.originalCase.set(token, raw);
      let tb = this.tokens.get(token);
      if (!tb) {
        tb = new Set();
        this.tokens.set(token, tb);
        this.#insertPrefixPath(token);
      }
      tb.add(recordId);
    }
  }

  /** Only the value/token *vocabulary* lives in the trie; postings stay in the maps. */
  #insertPrefixPath(text) {
    let node = this.root;
    const limit = Math.min(text.length, this.maxPrefix);
    for (let i = 0; i < limit; i += 1) {
      const ch = text[i];
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
      node.values.add(text);
    }
  }

  remove(rawKey, recordId) {
    const key = String(rawKey);
    if (key === EMPTY_KEY) {
      this.emptyIds.delete(recordId);
      return;
    }
    const lower = key.toLowerCase();
    this.values.get(lower)?.delete(recordId);
    if (this.values.get(lower)?.size === 0) this.values.delete(lower);
    for (const token of tokenize(key)) {
      this.tokens.get(token)?.delete(recordId);
      if (this.tokens.get(token)?.size === 0) this.tokens.delete(token);
    }
  }

  #idsForVocabulary(words) {
    const out = new Set();
    for (const word of words) {
      for (const id of this.values.get(word) || []) out.add(id);
      for (const id of this.tokens.get(word) || []) out.add(id);
    }
    return out;
  }

  #prefixVocabulary(prefix) {
    let node = this.root;
    const limit = Math.min(prefix.length, this.maxPrefix);
    for (let i = 0; i < limit; i += 1) {
      node = node.children.get(prefix[i]);
      if (!node) return [];
    }
    // Beyond maxPrefix the trie is only a coarse filter — refine with a check.
    return prefix.length > this.maxPrefix ? [...node.values].filter((v) => v.startsWith(prefix)) : [...node.values];
  }

  query(operator, value) {
    const needle = String(value ?? '').toLowerCase();
    switch (operator) {
      case OPERATOR.eq:
        return new Set(this.values.get(needle) || []);
      case OPERATOR.in: {
        const out = new Set();
        for (const v of Array.isArray(value) ? value : [value]) {
          for (const id of this.values.get(String(v).toLowerCase()) || []) out.add(id);
        }
        return out;
      }
      case OPERATOR.startsWith:
        return this.#idsForVocabulary(this.#prefixVocabulary(needle));
      case OPERATOR.endsWith: {
        const matches = [...this.values.keys()].filter((v) => v.endsWith(needle));
        return this.#idsForVocabulary(matches);
      }
      case OPERATOR.contains: {
        const fromPrefix = this.#prefixVocabulary(needle);
        const out = this.#idsForVocabulary(fromPrefix);
        for (const v of this.values.keys()) {
          if (v.includes(needle)) for (const id of this.values.get(v)) out.add(id);
        }
        for (const t of this.tokens.keys()) {
          if (t.includes(needle)) for (const id of this.tokens.get(t)) out.add(id);
        }
        return out;
      }
      case OPERATOR.isEmpty:
        return new Set(this.emptyIds);
      case OPERATOR.isNotEmpty:
        return this.#allIds();
      case OPERATOR.neq: {
        const out = this.#allIds();
        for (const id of this.values.get(needle) || []) out.delete(id);
        for (const id of this.emptyIds) out.add(id);
        return out;
      }
      default:
        return null;
    }
  }

  #allIds() {
    const out = new Set();
    for (const ids of this.values.values()) for (const id of ids) out.add(id);
    return out;
  }

  /** Type-ahead for `GET /search/suggest`. */
  suggest(prefix, limit = 10) {
    const needle = String(prefix ?? '').toLowerCase();
    return this.#prefixVocabulary(needle)
      .map((v) => ({ value: this.originalCase.get(v) || v, count: (this.values.get(v) || this.tokens.get(v) || new Set()).size }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
      .slice(0, limit);
  }

  cardinality() {
    return this.values.size;
  }

  stats() {
    let postings = this.emptyIds.size;
    for (const ids of this.values.values()) postings += ids.size;
    return { keys: this.values.size, tokens: this.tokens.size, postings };
  }

  /** Persist only the value postings; the trie and token map are derived on load. */
  serialize() {
    const rows = [...this.values.entries()].map(([key, ids]) => ({
      key: this.originalCase.get(key) || key,
      recordIds: [...ids],
    }));
    if (this.emptyIds.size) rows.push({ key: EMPTY_KEY, recordIds: [...this.emptyIds] });
    return rows;
  }

  load(rows) {
    this.build(rows.flatMap((row) => row.recordIds.map((recordId) => ({ keys: [row.key], recordId }))));
    return this;
  }
}
