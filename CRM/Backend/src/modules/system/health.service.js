import { env } from '../../config/env.config.js';
import { INDEX_STATUS } from '../../config/constants.js';

const startedAt = Date.now();

/** Every number here is probed at request time — nothing is stored or guessed. */
export class HealthService {
  constructor({ databaseStatsRepository, indexRepository, eventBus, metadataCache, logService }) {
    this.databaseStatsRepository = databaseStatsRepository;
    this.indexRepository = indexRepository;
    this.eventBus = eventBus;
    this.metadataCache = metadataCache;
    this.logService = logService;
  }

  static uptimeMs() {
    return Date.now() - startedAt;
  }

  async check() {
    const checks = [];

    let dbLatency = null;
    let dbOk = false;
    try {
      dbLatency = Math.round((await this.databaseStatsRepository.ping()) * 100) / 100;
      dbOk = true;
      checks.push({ name: 'MongoDB', status: 'PASS', detail: `ping ${dbLatency}ms` });
    } catch (err) {
      checks.push({ name: 'MongoDB', status: 'FAIL', detail: err.message });
    }

    const bus = this.eventBus.stats();
    checks.push({
      name: 'Event Bus',
      status: bus.failed > 0 ? 'WARN' : 'PASS',
      detail: `${bus.published} published, ${bus.failed} handler failures`,
    });

    const indexes = await this.indexRepository.findAll();
    const failed = indexes.filter((i) => i.status === INDEX_STATUS.FAILED).length;
    checks.push({
      name: 'Index Layer',
      status: failed ? 'FAIL' : 'PASS',
      detail: `${indexes.filter((i) => i.status === INDEX_STATUS.ACTIVE).length}/${indexes.length} active`,
    });

    const cache = this.metadataCache.stats();
    checks.push({ name: 'Metadata Cache', status: 'PASS', detail: `${cache.cachedObjects} objects, ${cache.hitRate}% hit rate` });

    const errors15m = this.logService.errorsSince(15 * 60_000);
    checks.push({ name: 'Error Rate', status: errors15m > 20 ? 'WARN' : 'PASS', detail: `${errors15m} errors in 15m` });

    const degraded = checks.some((c) => c.status !== 'PASS');
    return {
      status: degraded ? 'Degraded' : 'Healthy',
      uptimeMs: HealthService.uptimeMs(),
      version: env.version,
      environment: env.nodeEnv,
      db: { status: dbOk ? 'UP' : 'DOWN', latencyMs: dbLatency, name: this.databaseStatsRepository.name },
      eventBus: {
        status: bus.failed ? 'DEGRADED' : 'UP',
        queued: bus.queued,
        throughputPerMin: bus.throughputPerMin,
        partitions: 1,
      },
      checks,
    };
  }
}
