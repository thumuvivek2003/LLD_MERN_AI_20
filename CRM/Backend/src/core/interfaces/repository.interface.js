import { NotImplementedError } from '../exceptions/not-implemented.error.js';

/**
 * IRepository — persistence boundary (ISP: intentionally tiny).
 * Swapping Mongo for Postgres means writing new implementations of this,
 * and touching zero service files.
 */
export class IRepository {
  create(_data) {
    throw new NotImplementedError('IRepository.create');
  }

  findOne(_filter) {
    throw new NotImplementedError('IRepository.findOne');
  }

  find(_filter, _options) {
    throw new NotImplementedError('IRepository.find');
  }

  updateOne(_filter, _update) {
    throw new NotImplementedError('IRepository.updateOne');
  }

  deleteOne(_filter) {
    throw new NotImplementedError('IRepository.deleteOne');
  }

  count(_filter) {
    throw new NotImplementedError('IRepository.count');
  }
}
