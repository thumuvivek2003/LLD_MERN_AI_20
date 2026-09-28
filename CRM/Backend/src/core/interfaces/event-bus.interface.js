import { NotImplementedError } from '../exceptions/not-implemented.error.js';

/**
 * IEventBus — Observer boundary.
 * Swapping the in-process bus for Kafka means one new implementation;
 * publishers and subscribers stay untouched.
 */
export class IEventBus {
  publish(_type, _payload) {
    throw new NotImplementedError('IEventBus.publish');
  }

  subscribe(_type, _handler) {
    throw new NotImplementedError('IEventBus.subscribe');
  }

  subscribeAll(_handler) {
    throw new NotImplementedError('IEventBus.subscribeAll');
  }
}
