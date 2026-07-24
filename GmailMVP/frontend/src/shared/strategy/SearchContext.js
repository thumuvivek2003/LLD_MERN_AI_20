import { AllSearchStrategy } from './AllSearchStrategy.js';
import { FieldSearchStrategy } from './FieldSearchStrategy.js';

/**
 * Strategy context: resolves and holds the active search strategy.
 */
const STRATEGIES = {
  all: new AllSearchStrategy(),
  from: new FieldSearchStrategy('from', 'From'),
  to: new FieldSearchStrategy('to', 'To'),
  subject: new FieldSearchStrategy('subject', 'Subject'),
  body: new FieldSearchStrategy('body', 'Body'),
};

export const SEARCH_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'subject', label: 'Subject' },
];

export class SearchContext {
  constructor(type = 'all') {
    this.setStrategy(type);
  }
  setStrategy(type) {
    this.strategy = STRATEGIES[type] || STRATEGIES.all;
    return this;
  }
  buildParams(userId, q) {
    return this.strategy.buildParams(userId, q);
  }
  filterLocally(vms, q) {
    return vms.filter((vm) => this.strategy.matches(vm, q));
  }
}

export function getStrategy(type) {
  return STRATEGIES[type] || STRATEGIES.all;
}

export default SearchContext;
