import { IndexMapper } from './index.mapper.js';
import { INDEX_STATUS } from '../../config/constants.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';

/**
 * Index module's API surface. Thin on purpose — all structural work belongs to
 * the IndexManager; this class only shapes contract responses and turns a
 * rebuild request into a background job.
 */
export class IndexService {
  constructor({ indexManager, indexRepository, recordRepository, metadataCache, jobRegistry }) {
    this.indexManager = indexManager;
    this.indexRepository = indexRepository;
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.jobRegistry = jobRegistry;
  }

  async #context(def) {
    const objectDef = await this.metadataCache.getObject(def.objectId);
    const field = objectDef?.fields?.find((f) => f.fieldId === def.fieldId);
    const activeRecordCount = await this.recordRepository.countByObject(def.objectId, 'ACTIVE');
    return { objectLabel: objectDef?.label, fieldLabel: field?.label, activeRecordCount };
  }

  async list({ objectId, status } = {}) {
    const filter = {};
    if (objectId) filter.objectId = objectId;
    if (status) filter.status = status;
    const defs = await this.indexRepository.findAll(filter);

    const counts = new Map();
    for (const row of await this.recordRepository.groupCountByObject()) counts.set(row._id, row.count);
    const objects = await this.metadataCache.getAllObjects();
    const byId = new Map(objects.map((o) => [o.objectId, o]));

    return defs.map((def) => {
      const objectDef = byId.get(def.objectId);
      return IndexMapper.toListItem(def, {
        objectLabel: objectDef?.label,
        fieldLabel: objectDef?.fields?.find((f) => f.fieldId === def.fieldId)?.label,
        activeRecordCount: counts.get(def.objectId) || 0,
      });
    });
  }

  async summary() {
    const rows = await this.indexRepository.summary();
    const base = { total: 0, healthy: 0, building: 0, failed: 0, inactive: 0 };
    for (const row of rows) {
      base.total += row.n;
      if (row._id === INDEX_STATUS.ACTIVE) base.healthy = row.n;
      if (row._id === INDEX_STATUS.BUILDING) base.building = row.n;
      if (row._id === INDEX_STATUS.FAILED) base.failed = row.n;
      if (row._id === INDEX_STATUS.INACTIVE) base.inactive = row.n;
    }
    return base;
  }

  async get(indexId) {
    const def = await this.indexRepository.findByIndexId(indexId);
    if (!def) throw new NotFoundError('Index', indexId);
    return IndexMapper.toDetail(def, await this.#context(def), this.indexManager.performanceFor(indexId));
  }

  async create({ objectId, fieldId, type }) {
    if (!objectId || !fieldId) throw new BadRequestError('objectId and fieldId are required');
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);
    if (!objectDef.fields.some((f) => f.fieldId === fieldId)) throw new NotFoundError('Field', fieldId);

    const def = await this.indexManager.ensureIndex(objectId, fieldId, type);
    const built = await this.indexManager.build(def.indexId);
    return IndexMapper.toDetail(built, await this.#context(built), this.indexManager.performanceFor(def.indexId));
  }

  async rebuild(indexId) {
    const def = await this.indexRepository.findByIndexId(indexId);
    if (!def) throw new NotFoundError('Index', indexId);
    const job = this.jobRegistry.register({
      name: `Rebuild ${def.name}`,
      detail: `${def.objectId}.${def.fieldId} (${def.type})`,
      handler: async () => {
        const rebuilt = await this.indexManager.build(indexId);
        return { detail: `${rebuilt.docCount} documents in ${rebuilt.buildMs}ms` };
      },
    });
    return this.jobRegistry.runDetached(job.jobId);
  }

  async rebuildAll(objectId = null) {
    const defs = await this.indexRepository.findAll(objectId ? { objectId } : {});
    const job = this.jobRegistry.register({
      name: 'Rebuild all indexes',
      detail: `${defs.length} indexes queued`,
      handler: async ({ report }) => {
        let done = 0;
        for (const def of defs) {
          await this.indexManager.build(def.indexId).catch(() => {});
          done += 1;
          report((done / Math.max(1, defs.length)) * 100);
        }
        return { detail: `${done}/${defs.length} indexes rebuilt` };
      },
    });
    return this.jobRegistry.runDetached(job.jobId);
  }

  async remove(indexId) {
    await this.indexManager.drop(indexId);
    return { indexId, deleted: true };
  }
}
