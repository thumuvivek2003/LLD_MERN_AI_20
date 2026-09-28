import { NotImplementedError } from '../exceptions/not-implemented.error.js';

/** ICache — read-through cache boundary. Implemented by MetadataCache (Singleton). */
export class ICache {
  get(_key) {
    throw new NotImplementedError('ICache.get');
  }

  set(_key, _value) {
    throw new NotImplementedError('ICache.set');
  }

  invalidate(_key) {
    throw new NotImplementedError('ICache.invalidate');
  }

  clear() {
    throw new NotImplementedError('ICache.clear');
  }

  stats() {
    throw new NotImplementedError('ICache.stats');
  }
}
