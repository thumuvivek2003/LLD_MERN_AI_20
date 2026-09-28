import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';

export const viewController = {
  list: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.viewService.list(req.query.objectId, req.actor));
  }),

  create: asyncHandler(async (req, res) => {
    ApiResponse.created(res, await req.container.viewService.create(req.body, req.actor));
  }),

  patch: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.viewService.update(req.params.viewId, req.body, req.actor));
  }),

  remove: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.viewService.remove(req.params.viewId, req.actor));
  }),
};
