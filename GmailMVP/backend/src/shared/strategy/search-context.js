import { InvertedIndexStrategy } from './inverted-index.strategy.js';

/**
 * SearchContext (Strategy pattern context)
 * ------------------------------------------------------------------
 * Holds the currently selected search strategy and delegates indexing /
 * querying to it. Defaults to the InvertedIndexStrategy.
 */
export class SearchContext {
  /** @param {import('./search-strategy.js').SearchStrategy} [strategy] */
  constructor(strategy = new InvertedIndexStrategy()) {
    this.strategy = strategy;
  }

  /** @param {import('./search-strategy.js').SearchStrategy} strategy */
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  /** @returns {string} name of active strategy */
  get strategyName() {
    return this.strategy.name;
  }

  addDocument(id, text) {
    this.strategy.addDocument(id, text);
  }

  removeDocument(id) {
    this.strategy.removeDocument(id);
  }

  clear() {
    this.strategy.clear();
  }

  /**
   * @param {string} query
   * @returns {string[]} candidate mail ids
   */
  executeSearch(query) {
    return this.strategy.search(query);
  }
}
