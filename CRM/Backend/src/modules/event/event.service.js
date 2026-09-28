const RING_SIZE = 500;

/**
 * Event history for the System console's Event Monitor.
 *
 * A bounded in-memory ring answers `/system/events` instantly; the same rows are
 * mirrored to Mongo (fire-and-forget) so history survives a restart. The ring is
 * the read path, Mongo is the archive.
 */
export class EventService {
  constructor({ eventRepository }) {
    this.eventRepository = eventRepository;
    this.ring = [];
    this.byType = new Map();
  }

  record(envelope) {
    const row = {
      eventId: envelope.eventId,
      type: envelope.type,
      objectId: envelope.payload?.objectId || null,
      objectLabel: envelope.payload?.objectLabel || envelope.payload?.objectId || '',
      payloadSummary: EventService.summarise(envelope),
      at: envelope.at,
      status: 'PROCESSED',
    };
    this.ring.unshift(row);
    if (this.ring.length > RING_SIZE) this.ring.length = RING_SIZE;
    this.byType.set(envelope.type, (this.byType.get(envelope.type) || 0) + 1);
    return row;
  }

  persist(row) {
    return this.eventRepository.create(row);
  }

  list({ type, limit = 50 } = {}) {
    const filtered = type ? this.ring.filter((e) => e.type === type) : this.ring;
    if (filtered.length) return Promise.resolve(filtered.slice(0, Number(limit)));
    return this.eventRepository.list({ type, limit: Number(limit) });
  }

  typeCounts() {
    return Object.fromEntries([...this.byType.entries()].sort((a, b) => b[1] - a[1]));
  }

  static summarise(envelope) {
    const p = envelope.payload || {};
    const bits = [];
    if (p.displayName) bits.push(p.displayName);
    else if (p.fieldLabel) bits.push(p.fieldLabel);
    else if (p.objectLabel) bits.push(p.objectLabel);
    if (p.recordId) bits.push(p.recordId);
    if (p.docCount !== undefined) bits.push(`${p.docCount} docs`);
    if (p.buildMs !== undefined) bits.push(`${p.buildMs}ms`);
    if (p.action) bits.push(p.action);
    if (p.errors?.length) bits.push(`${p.errors.length} error(s)`);
    return bits.join(' · ') || envelope.type;
  }
}
