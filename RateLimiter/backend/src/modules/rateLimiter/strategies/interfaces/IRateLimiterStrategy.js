export class IRateLimiterStrategy {
  // eslint-disable-next-line no-unused-vars
  allowRequest(_context, _state, _config) {
    throw new Error('allowRequest() must be implemented by subclass');
  }

  get type() {
    throw new Error('type getter must be implemented by subclass');
  }
}
