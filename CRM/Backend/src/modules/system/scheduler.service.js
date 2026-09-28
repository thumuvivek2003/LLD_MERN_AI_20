import { INDEX_STATUS, RECORD_STATUS } from '../../config/constants.js';
import { logger } from '../../core/utils/logger.util.js';

const MINUTE = 60_000;

/**
 * Registers the platform's periodic jobs.
 *
 * These are the "System (background)" actor's responsibilities from
 * main_flow.png — clean-up jobs, index maintenance, cache warming — and they do
 * real work, so `/system/jobs` shows genuine timings and progress.
 */
export class SchedulerService {
  constructor({ jobRegistry, indexManager, indexRepository, recordRepository, metadataCache, auditService, settingRepository }) {
    this.jobRegistry = jobRegistry;
    this.indexManager = indexManager;
    this.indexRepository = indexRepository;
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.auditService = auditService;
    this.settingRepository = settingRepository;
  }

  registerAll() {
    this.jobRegistry.schedule({
      jobId: 'job_index_optimization',
      name: 'Index Optimization',
      detail: 'Rebuilds indexes that have drifted from the record count',
      everyMs: 10 * MINUTE,
      handler: ({ report }) => this.#optimizeIndexes(report),
    });

    this.jobRegistry.schedule({
      jobId: 'job_audit_archive',
      name: 'Audit Archive',
      detail: 'Purges audit rows past the retention window',
      everyMs: 30 * MINUTE,
      handler: () => this.#archiveAudit(),
    });

    this.jobRegistry.schedule({
      jobId: 'job_orphan_cleanup',
      name: 'Orphan Cleanup',
      detail: 'Drops index definitions whose field no longer exists',
      everyMs: 15 * MINUTE,
      handler: () => this.#cleanupOrphans(),
    });

    this.jobRegistry.schedule({
      jobId: 'job_cache_refresh',
      name: 'Metadata Cache Refresh',
      detail: 'Re-warms the metadata cache',
      everyMs: 5 * MINUTE,
      handler: () => this.#refreshCache(),
    });

    logger.info(`Scheduler registered ${this.jobRegistry.list().length} background jobs`, null, 'scheduler');
    return this;
  }

  async #optimizeIndexes(report) {
    const defs = await this.indexRepository.findAll({ status: INDEX_STATUS.ACTIVE });
    let rebuilt = 0;
    for (const [i, def] of defs.entries()) {
      const live = await this.recordRepository.countByObject(def.objectId, RECORD_STATUS.ACTIVE);
      const drift = live ? Math.abs(live - def.docCount) / live : 0;
      if (drift > 0.05) {
        await this.indexManager.build(def.indexId).catch(() => {});
        rebuilt += 1;
      }
      report(((i + 1) / Math.max(1, defs.length)) * 100);
    }
    return { detail: `${defs.length} indexes checked, ${rebuilt} rebuilt` };
  }

  async #archiveAudit() {
    const settings = await this.settingRepository.get();
    const result = await this.auditService.purgeOlderThan(settings.auditRetentionDays || 90);
    return { detail: `${result?.deletedCount || 0} audit rows purged (retention ${settings.auditRetentionDays}d)` };
  }

  async #cleanupOrphans() {
    const defs = await this.indexRepository.findAll();
    let dropped = 0;
    for (const def of defs) {
      const objectDef = await this.metadataCache.getObject(def.objectId);
      const stillThere = objectDef?.fields?.some((f) => f.fieldId === def.fieldId);
      if (!stillThere) {
        await this.indexManager.drop(def.indexId).catch(() => {});
        dropped += 1;
      }
    }
    return { detail: dropped ? `${dropped} orphaned index(es) dropped` : 'No orphans found' };
  }

  async #refreshCache() {
    const count = await this.metadataCache.refresh();
    return { detail: `${count} objects warmed` };
  }
}
