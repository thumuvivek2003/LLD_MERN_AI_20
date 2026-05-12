export class BaseService {
  async execute(action, ...args) {
    if (typeof action !== 'function') throw new Error('execute() requires a function');
    return action(...args);
  }
}
