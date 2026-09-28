import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { buildMeta } from '../../core/utils/pagination.util.js';

export const searchController = {
  search: asyncHandler(async (req, res) => {
    const { records, plan, total, page, limit } = await req.container.searchService.search(req.body, req.actor);
    res.json({ success: true, data: { records, plan }, meta: buildMeta(page, limit, total) });
  }),

  suggest: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.searchService.suggest(req.query));
  }),
};
