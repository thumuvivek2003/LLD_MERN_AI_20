import { AssignmentStrategy } from './assignment-strategy.interface.js';

export class BestRatedStrategy extends AssignmentStrategy {
  async assign({ partners }) {
    if (!partners.length) return null;
    return [...partners].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  }
}
