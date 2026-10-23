import { randomUUID } from 'crypto';

export class BaseRepository {
  constructor(store) {
    this.store = store;
  }

  create(entity) {
    if (!entity.id) entity.id = randomUUID();
    this.store.set(entity.id, entity);
    return entity;
  }

  findById(id) {
    return this.store.get(id) || null;
  }

  findAll() {
    return [...this.store.values()];
  }

  find(predicate) {
    return this.findAll().filter(predicate);
  }

  findOne(predicate) {
    return this.findAll().find(predicate) || null;
  }

  update(id, patch) {
    const entity = this.store.get(id);
    if (!entity) return null;
    Object.assign(entity, patch);
    return entity;
  }

  delete(id) {
    return this.store.delete(id);
  }
}
