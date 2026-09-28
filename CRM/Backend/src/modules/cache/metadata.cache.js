import { ICache } from '../../core/interfaces/cache.interface.js';
import { EVENT_TYPE } from '../../config/constants.js';

/**
 * Metadata Cache — Singleton, read-through, in front of the object repository.
 *
 * chat.md's argument: every record operation needs the object + its fields
 * before it can validate or index anything. Hitting Mongo for metadata on every
 * write would dominate the request. So metadata is read through here, and only
 * object/field events evict it.
 *
 * Deliberately a Singleton (not just a module-level object) because
 * `/system/cache` reports on exactly one instance and `POST /system/cache/refresh`
 * must warm that same instance.
 */
export class MetadataCache extends ICache {
  static #instance = null;

  constructor(objectRepository, { ttlSeconds = 300 } = {}) {
    super();
    this.objectRepository = objectRepository;
    this.ttlMs = ttlSeconds * 1000;
    this.store = new Map(); // objectId -> { value, at }
    this.allKey = null; // cached full list
    this.counters = { hits: 0, misses: 0, evictions: 0 };
    this.lastRefreshAt = null;
  }

  static getInstance(objectRepository, options) {
    if (!MetadataCache.#instance) MetadataCache.#instance = new MetadataCache(objectRepository, options);
    return MetadataCache.#instance;
  }

  static reset() {
    MetadataCache.#instance = null;
  }

  #fresh(entry) {
    return entry && Date.now() - entry.at < this.ttlMs;
  }

  async getObject(objectId) {
    if (!objectId) return null;
    const entry = this.store.get(objectId);
    if (this.#fresh(entry)) {
      this.counters.hits += 1;
      return entry.value;
    }
    this.counters.misses += 1;
    const value = await this.objectRepository.findByObjectId(objectId);
    if (value) this.store.set(objectId, { value, at: Date.now() });
    return value;
  }

  async getAllObjects() {
    if (this.#fresh(this.allKey)) {
      this.counters.hits += 1;
      return this.allKey.value;
    }
    this.counters.misses += 1;
    const value = await this.objectRepository.findAll();
    this.allKey = { value, at: Date.now() };
    for (const obj of value) this.store.set(obj.objectId, { value: obj, at: Date.now() });
    return value;
  }

  async getField(objectId, fieldId) {
    const objectDef = await this.getObject(objectId);
    return objectDef?.fields?.find((f) => f.fieldId === fieldId) || null;
  }

  get(key) {
    const entry = this.store.get(key);
    if (this.#fresh(entry)) {
      this.counters.hits += 1;
      return entry.value;
    }
    this.counters.misses += 1;
    return null;
  }

  set(key, value) {
    this.store.set(key, { value, at: Date.now() });
    return value;
  }

  invalidate(objectId) {
    if (this.store.delete(objectId)) this.counters.evictions += 1;
    this.allKey = null;
  }

  clear() {
    this.counters.evictions += this.store.size;
    this.store.clear();
    this.allKey = null;
  }

  /** Warm every published object in one pass. */
  async refresh() {
    this.clear();
    const all = await this.objectRepository.findAll();
    this.allKey = { value: all, at: Date.now() };
    for (const obj of all) this.store.set(obj.objectId, { value: obj, at: Date.now() });
    this.lastRefreshAt = new Date();
    return all.length;
  }

  stats() {
    const total = this.counters.hits + this.counters.misses;
    let cachedFields = 0;
    for (const { value } of this.store.values()) cachedFields += value?.fields?.length || 0;
    const sizeBytes = Buffer.byteLength(JSON.stringify([...this.store.values()].map((e) => e.value)), 'utf8');
    return {
      hitRate: total ? Math.round((this.counters.hits / total) * 1000) / 10 : 0,
      size: this.store.size,
      sizeBytes,
      cachedObjects: this.store.size,
      cachedFields,
      lastRefreshAt: this.lastRefreshAt,
      hits: this.counters.hits,
      misses: this.counters.misses,
      evictions: this.counters.evictions,
      ttlSeconds: this.ttlMs / 1000,
    };
  }

  /** Wired by the cache subscriber; kept here so the invalidation rules live with the cache. */
  static invalidatingEvents() {
    return [
      EVENT_TYPE.OBJECT_CREATED,
      EVENT_TYPE.OBJECT_UPDATED,
      EVENT_TYPE.OBJECT_PUBLISHED,
      EVENT_TYPE.OBJECT_ARCHIVED,
      EVENT_TYPE.OBJECT_CLONED,
      EVENT_TYPE.FIELD_CREATED,
      EVENT_TYPE.FIELD_UPDATED,
      EVENT_TYPE.FIELD_DELETED,
      EVENT_TYPE.FIELD_REORDERED,
    ];
  }
}
