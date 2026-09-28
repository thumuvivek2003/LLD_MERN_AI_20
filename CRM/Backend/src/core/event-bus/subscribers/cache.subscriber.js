import { EVENT_TYPE } from '../../../config/constants.js';
import { MetadataCache } from '../../../modules/cache/metadata.cache.js';

/**
 * Cache invalidation.
 *
 * Only schema events evict metadata — record writes change data, not shape.
 * Keeping this rule in one subscriber is why the object and field services can
 * stay unaware that a cache exists at all.
 */
export function registerCacheSubscriber({ eventBus, metadataCache, permissionService }) {
  for (const type of MetadataCache.invalidatingEvents()) {
    eventBus.subscribe(type, ({ payload }) => {
      metadataCache.invalidate(payload.objectId);
      eventBus.publish(EVENT_TYPE.CACHE_INVALIDATED, {
        objectId: payload.objectId,
        objectLabel: payload.objectLabel,
        reason: type,
      });
    });
  }

  // A new object means every role's `"*"` fallback now covers one more object.
  eventBus.subscribe(EVENT_TYPE.OBJECT_CREATED, () => permissionService.invalidate());
}
