import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';

export const indexController = {
  list: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.indexService.list({ objectId: req.query.objectId, status: req.query.status }));
  }),

  summary: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.indexService.summary());
  }),

  get: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.indexService.get(req.params.indexId));
  }),

  create: asyncHandler(async (req, res) => {
    ApiResponse.created(res, await req.container.indexService.create(req.body));
  }),

  rebuild: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.indexService.rebuild(req.params.indexId));
  }),

  rebuildAll: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.indexService.rebuildAll(req.body?.objectId || null));
  }),

  remove: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.indexService.remove(req.params.indexId));
  }),
};
