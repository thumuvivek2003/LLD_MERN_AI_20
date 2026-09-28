import { auditId as newAuditId } from '../../core/utils/id.util.js';
import { diffRecordJson } from '../../core/utils/diff.util.js';

/**
 * Audit Engine.
 *
 * `write()` is only ever called by the audit event subscriber — no business
 * service writes audit rows directly. That indirection is what lets audit be
 * switched off, batched, or shipped elsewhere without touching a single service.
 */
export class AuditService {
  constructor({ auditRepository, metadataCache, userRepository }) {
    this.auditRepository = auditRepository;
    this.metadataCache = metadataCache;
    this.userRepository = userRepository;
    this.userNames = new Map();
  }

  async #userName(userId) {
    if (!userId) return 'System';
    if (this.userNames.has(userId)) return this.userNames.get(userId);
    const user = await this.userRepository.findByUserId(userId);
    const name = user?.name || userId;
    this.userNames.set(userId, name);
    return name;
  }

  /** Builds the field-level `changes[]` diff and persists one audit row. */
  async write({ action, objectId, objectLabel, recordId, recordDisplayName, userId, summary, before, after }) {
    let changes = [];
    if (before || after) {
      const objectDef = objectId ? await this.metadataCache.getObject(objectId) : null;
      changes = diffRecordJson(before || {}, after || {}, objectDef?.fields || []);
    }
    return this.auditRepository.create({
      auditId: newAuditId(),
      at: new Date(),
      userId: userId || 'u_system',
      userName: await this.#userName(userId),
      action,
      objectId: objectId || null,
      objectLabel: objectLabel || objectId || '',
      recordId: recordId || null,
      recordDisplayName: recordDisplayName || '',
      summary: summary || '',
      changes,
    });
  }

  async query(filters) {
    const [items, total] = await this.auditRepository.query(filters);
    return { items, total };
  }

  recent(limit = 10) {
    return this.auditRepository.recent(limit);
  }

  purgeOlderThan(days) {
    const cutoff = new Date(Date.now() - days * 86_400_000);
    return this.auditRepository.deleteOlderThan(cutoff);
  }
}
