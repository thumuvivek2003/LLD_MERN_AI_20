/**
 * SearchStrategy (interface — Strategy pattern)
 * ------------------------------------------------------------------
 * A search strategy owns an index of documents and answers queries with a
 * list of candidate mail ids. Concrete strategies:
 *   - InvertedIndexStrategy (default, token → Set<mailId>)
 *   - SubstringStrategy      (naive fallback, contains match)
 *
 * This base class documents the contract; subclasses override the methods.
 */
export class SearchStrategy {
  /** Human-readable name of the strategy. @returns {string} */
  get name() {
    return 'base';
  }

  /**
   * Add / index a document.
   * @param {string} id  mail id
   * @param {string} text searchable text
   */
  // eslint-disable-next-line no-unused-vars
  addDocument(id, text) {
    throw new Error('SearchStrategy.addDocument() not implemented');
  }

  /**
   * Remove a document from the index.
   * @param {string} id mail id
   */
  // eslint-disable-next-line no-unused-vars
  removeDocument(id) {
    throw new Error('SearchStrategy.removeDocument() not implemented');
  }

  /** Clear the whole index. */
  clear() {
    throw new Error('SearchStrategy.clear() not implemented');
  }

  /**
   * Return candidate mail ids matching the query.
   * @param {string} query raw query text
   * @returns {string[]} candidate mail ids
   */
  // eslint-disable-next-line no-unused-vars
  search(query) {
    throw new Error('SearchStrategy.search() not implemented');
  }
}
