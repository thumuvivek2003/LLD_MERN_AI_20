import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';

export const lookupController = {
  options: asyncHandler(async (req, res) => {
    ApiResponse.ok(
      res,
      await req.container.lookupService.options({
        objectId: req.query.objectId,
        q: req.query.q,
        limit: Number(req.query.limit) || 20,
      }),
    );
  }),

  graph: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.lookupService.graph());
  }),

  stats: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.lookupService.stats());
  }),
};
