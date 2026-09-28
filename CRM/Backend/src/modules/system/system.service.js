import { env } from '../../config/env.config.js';
import { alertId as newAlertId } from '../../core/utils/id.util.js';
import { HealthService } from './health.service.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';

/** Overview tiles, storage, settings and alerts. */
export class SystemService {
  constructor({
    objectRepository,
    recordRepository,
    indexRepository,
    databaseStatsRepository,
    settingRepository,
    alertRepository,
    metadataCache,
    metricsService,
  }) {
    this.objectRepository = objectRepository;
    this.recordRepository = recordRepository;
    this.indexRepository = indexRepository;
    this.databaseStatsRepository = databaseStatsRepository;
    this.settingRepository = settingRepository;
    this.alertRepository = alertRepository;
    this.metadataCache = metadataCache;
    this.metricsService = metricsService;
  }

  /** The 4 KPI tiles shared by the admin header and the system dashboard. */
  async overview() {
    const objects = await this.metadataCache.getAllObjects();
    const [{ total: fields } = { total: 0 }] = await this.objectRepository.countFields();
    const [records, indexes] = await Promise.all([
      this.recordRepository.totalCount(),
      this.indexRepository.count(),
    ]);
    return { objects: objects.length, fields, records, indexes };
  }

  async storage() {
    const stats = await this.metricsService.storage();
    const collections = await this.databaseStatsRepository.collectionStats();
    return {
      database: {
        status: this.databaseStatsRepository.readyState === 1 ? 'Connected' : 'Disconnected',
        name: this.databaseStatsRepository.name,
        usedBytes: stats.usedBytes,
        totalBytes: stats.totalBytes,
        percent: stats.percent,
      },
      collections,
    };
  }

  async settings() {
    const doc = await this.settingRepository.get();
    return {
      environment: env.nodeEnv,
      version: env.version,
      uptime: HealthService.uptimeMs(),
      indexingMode: doc.indexingMode,
      cacheTtlSeconds: doc.cacheTtlSeconds,
      auditRetentionDays: doc.auditRetentionDays,
      maxBulkSize: doc.maxBulkSize,
      featureFlags: doc.featureFlags,
    };
  }

  async patchSettings(patch) {
    const update = {};
    for (const key of ['indexingMode', 'cacheTtlSeconds', 'auditRetentionDays', 'maxBulkSize', 'featureFlags']) {
      if (patch[key] !== undefined) update[key] = patch[key];
    }
    await this.settingRepository.patch(update);
    if (update.cacheTtlSeconds) this.metadataCache.ttlMs = update.cacheTtlSeconds * 1000;
    return this.settings();
  }

  listAlerts() {
    return this.alertRepository.listAll();
  }

  raiseAlert({ severity = 'INFO', title, message }) {
    return this.alertRepository.create({ alertId: newAlertId(), severity, title, message, at: new Date() });
  }

  async acknowledgeAlert(alertId) {
    const alert = await this.alertRepository.acknowledge(alertId);
    if (!alert) throw new NotFoundError('Alert', alertId);
    return alert;
  }
}
