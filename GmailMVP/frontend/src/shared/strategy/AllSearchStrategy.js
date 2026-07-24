import { SearchStrategy } from './SearchStrategy.js';

export class AllSearchStrategy extends SearchStrategy {
  get type() {
    return 'all';
  }
  get label() {
    return 'All';
  }
}
