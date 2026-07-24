import { SearchStrategy } from './search-strategy.js';

/**
 * SubstringStrategy (naive fallback)
 * ------------------------------------------------------------------
 * Stores the raw searchable text per document and answers a query with a
 * simple case-insensitive "contains" scan. Slower (O(n)) but tolerant of
 * partial-word matches — handy as a fallback when the inverted index misses.
 */
export class SubstringStrategy extends SearchStrategy {
  constructor() {
    super();
    /** @type {Map<string, string>} mail id -> lowercased text */
    this.docs = new Map();
  }

  get name() {
    return 'substring';
  }

  addDocument(id, text) {
    this.docs.set(String(id), (text || '').toLowerCase());
  }

  removeDocument(id) {
    this.docs.delete(String(id));
  }

  clear() {
    this.docs.clear();
  }

  search(query) {
    const needle = (query || '').trim().toLowerCase();
    if (!needle) return [];
    const results = [];
    for (const [id, text] of this.docs.entries()) {
      if (text.includes(needle)) results.push(id);
    }
    return results;
  }
}
