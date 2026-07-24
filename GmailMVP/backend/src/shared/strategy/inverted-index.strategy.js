import { SearchStrategy } from './search-strategy.js';
import { tokenize } from '../utils/tokenizer.util.js';

/**
 * InvertedIndexStrategy (default)
 * ------------------------------------------------------------------
 * Maintains an inverted index: Map<word, Set<mailId>>.
 * Query semantics: tokens are AND-intersected for precision; if the
 * intersection is empty we fall back to the UNION for better recall.
 */
export class InvertedIndexStrategy extends SearchStrategy {
  constructor() {
    super();
    /** @type {Map<string, Set<string>>} word -> set of mail ids */
    this.index = new Map();
    /** @type {Map<string, Set<string>>} mail id -> set of its tokens (for removal) */
    this.docTokens = new Map();
  }

  get name() {
    return 'inverted-index';
  }

  addDocument(id, text) {
    const mailId = String(id);
    // If re-indexing, drop old tokens first.
    if (this.docTokens.has(mailId)) this.removeDocument(mailId);

    const tokens = new Set(tokenize(text));
    this.docTokens.set(mailId, tokens);
    for (const token of tokens) {
      let bucket = this.index.get(token);
      if (!bucket) {
        bucket = new Set();
        this.index.set(token, bucket);
      }
      bucket.add(mailId);
    }
  }

  removeDocument(id) {
    const mailId = String(id);
    const tokens = this.docTokens.get(mailId);
    if (!tokens) return;
    for (const token of tokens) {
      const bucket = this.index.get(token);
      if (bucket) {
        bucket.delete(mailId);
        if (bucket.size === 0) this.index.delete(token);
      }
    }
    this.docTokens.delete(mailId);
  }

  clear() {
    this.index.clear();
    this.docTokens.clear();
  }

  search(query) {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];

    const buckets = tokens.map((t) => this.index.get(t) || new Set());

    // AND intersection.
    let intersection = null;
    for (const bucket of buckets) {
      if (intersection === null) {
        intersection = new Set(bucket);
      } else {
        intersection = new Set([...intersection].filter((id) => bucket.has(id)));
      }
    }
    if (intersection && intersection.size > 0) {
      return [...intersection];
    }

    // Fallback: OR union for recall.
    const union = new Set();
    for (const bucket of buckets) {
      for (const id of bucket) union.add(id);
    }
    return [...union];
  }

  /** Diagnostic helper. @returns {number} number of indexed terms */
  get size() {
    return this.index.size;
  }
}
