import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';

export const systemController = {
  health: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.healthService.check());
  }),

  metrics: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.metricsService.snapshot());
  }),

  overview: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.systemService.overview());
  }),

  events: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.eventService.list({ type: req.query.type, limit: req.query.limit || 50 }));
  }),

  eventTypes: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, req.container.eventService.typeCounts());
  }),

  jobs: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, req.container.jobRegistry.list());
  }),

  runJob: asyncHandler(async (req, res) => {
    const job = req.container.jobRegistry.runDetached(req.params.jobId);
    if (!job) throw new NotFoundError('Job', req.params.jobId);
    ApiResponse.ok(res, job);
  }),

  cache: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, req.container.metadataCache.stats());
  }),

  refreshCache: asyncHandler(async (req, res) => {
    const warmed = await req.container.metadataCache.refresh();
    ApiResponse.ok(res, { warmed, ...req.container.metadataCache.stats() });
  }),

  clearCache: asyncHandler(async (req, res) => {
    req.container.metadataCache.clear();
    ApiResponse.ok(res, req.container.metadataCache.stats());
  }),

  validationStats: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, req.container.validationService.getStats());
  }),

  logs: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, req.container.logService.list({ level: req.query.level, limit: req.query.limit || 100 }));
  }),

  logSummary: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, req.container.logService.summary());
  }),

  alerts: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.systemService.listAlerts());
  }),

  ackAlert: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.systemService.acknowledgeAlert(req.params.alertId));
  }),

  storage: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.systemService.storage());
  }),

  settings: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.systemService.settings());
  }),

  patchSettings: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.systemService.patchSettings(req.body || {}));
  }),

  indexStats: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, {
      ...(await req.container.indexService.summary()),
      memory: req.container.indexManager.memoryStats(),
    });
  }),
};
