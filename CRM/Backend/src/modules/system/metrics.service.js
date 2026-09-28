import os from 'node:os';
import { INDEX_STATUS } from '../../config/constants.js';

const SAMPLE_MS = 15_000;
const SERIES_LEN = 40;

/**
 * Metrics sampler.
 *
 * CPU comes from `process.cpuUsage()` deltas, memory from `process.memoryUsage()`
 * against `os.totalmem()`, disk from Mongo's `dbStats`. The only derived figure
 * is disk percent, which is storage-used against a nominal quota because a
 * single-node Mongo does not expose a volume size.
 */
export class MetricsService {
  constructor({ databaseStatsRepository, indexRepository, eventBus, metadataCache, jobRegistry, logService }) {
    this.databaseStatsRepository = databaseStatsRepository;
    this.indexRepository = indexRepository;
    this.eventBus = eventBus;
    this.metadataCache = metadataCache;
    this.jobRegistry = jobRegistry;
    this.logService = logService;

    this.series = { cpu: [], memory: [], disk: [] };
    this.lastCpu = process.cpuUsage();
    this.lastSampleAt = Date.now();
    this.diskPercent = 0;
    this.timer = null;
  }

  start() {
    this.sample();
    this.timer = setInterval(() => this.sample(), SAMPLE_MS);
    this.timer.unref?.();
    return this;
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  sample() {
    const now = Date.now();
    const elapsedMicros = Math.max(1, (now - this.lastSampleAt) * 1000);
    const cpu = process.cpuUsage(this.lastCpu);
    this.lastCpu = process.cpuUsage();
    this.lastSampleAt = now;

    const cpuPercent = Math.min(100, Math.round(((cpu.user + cpu.system) / elapsedMicros) * 100));
    const mem = process.memoryUsage();
    const memPercent = Math.round((mem.rss / os.totalmem()) * 1000) / 10;

    MetricsService.#push(this.series.cpu, { t: new Date(now).toISOString(), v: cpuPercent });
    MetricsService.#push(this.series.memory, { t: new Date(now).toISOString(), v: memPercent });
    MetricsService.#push(this.series.disk, { t: new Date(now).toISOString(), v: this.diskPercent });
  }

  static #push(arr, point) {
    arr.push(point);
    if (arr.length > SERIES_LEN) arr.shift();
  }

  async storage() {
    const stats = await this.databaseStatsRepository.dbStats();
    const usedBytes = (stats.dataSize || 0) + (stats.indexSize || 0);
    // Single-node Mongo exposes no volume size; use a 1 GiB nominal quota so the
    // gauge has a denominator. Clearly derived, not measured.
    const totalBytes = Math.max(1024 ** 3, usedBytes * 4);
    const percent = Math.round((usedBytes / totalBytes) * 1000) / 10;
    this.diskPercent = percent;
    return { usedBytes, totalBytes, percent, dataSize: stats.dataSize, indexSize: stats.indexSize };
  }

  async snapshot() {
    const bus = this.eventBus.stats();
    const jobs = this.jobRegistry.counts();
    const cache = this.metadataCache.stats();
    const indexes = await this.indexRepository.findAll();
    const storage = await this.storage();

    return {
      eventsPerMin: bus.throughputPerMin,
      eventsPublished: bus.published,
      jobsRunning: jobs.running,
      jobsQueued: jobs.queued,
      cacheHitRate: cache.hitRate,
      indexHealth: {
        active: indexes.filter((i) => i.status === INDEX_STATUS.ACTIVE).length,
        total: indexes.length,
      },
      errors15m: this.logService.errorsSince(15 * 60_000),
      storage: { usedBytes: storage.usedBytes, totalBytes: storage.totalBytes, percent: storage.percent },
      series: this.series,
    };
  }
}
