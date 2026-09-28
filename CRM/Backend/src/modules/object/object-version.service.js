import { diffObjectDefinition, summariseDiff } from '../../core/utils/diff.util.js';

/**
 * Object versioning.
 *
 * Every schema change bumps `version` and stores the diff, so an old record's
 * `objectVersion` still tells you which shape it was written against —
 * chat.md's "Customer v1 → v2 → v3" requirement.
 */
export class ObjectVersionService {
  constructor({ objectRepository, objectVersionRepository }) {
    this.objectRepository = objectRepository;
    this.objectVersionRepository = objectVersionRepository;
  }

  /** @returns {Promise<number>} the new version number */
  async recordChange(before, after, { userId, summary } = {}) {
    const diff = diffObjectDefinition(before, after);
    if (!diff.length && !summary) return before.version;

    const version = (before.version || 1) + 1;
    await this.objectRepository.updateByObjectId(after.objectId, { $set: { version } });
    await this.objectVersionRepository.create({
      objectId: after.objectId,
      version,
      changedAt: new Date(),
      changedBy: userId || 'u_system',
      summary: summary || summariseDiff(diff),
      diff,
    });
    return version;
  }

  async seedInitial(objectDef, userId) {
    await this.objectVersionRepository.create({
      objectId: objectDef.objectId,
      version: objectDef.version || 1,
      changedAt: new Date(),
      changedBy: userId || 'u_system',
      summary: 'Object created',
      diff: (objectDef.fields || []).map((f) => ({ kind: 'FIELD_ADDED', target: f.label, from: null, to: f.type })),
    });
  }

  list(objectId) {
    return this.objectVersionRepository.listForObject(objectId);
  }
}
