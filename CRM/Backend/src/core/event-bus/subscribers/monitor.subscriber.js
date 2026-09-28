/**
 * System event monitor. Subscribes to *everything* and keeps a bounded ring
 * buffer plus a Mongo mirror, which is what `GET /system/events` reads.
 */
export function registerMonitorSubscriber({ eventBus, eventService }) {
  eventBus.subscribeAll((envelope) => {
    const row = eventService.record(envelope);
    return eventService.persist(row).catch(() => {});
  });
}
