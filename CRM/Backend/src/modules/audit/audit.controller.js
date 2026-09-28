import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { parsePagination, buildMeta } from '../../core/utils/pagination.util.js';

export const auditController = {
  query: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { items, total } = await req.container.auditService.query({
      objectId: req.query.objectId,
      recordId: req.query.recordId,
      userId: req.query.userId,
      action: req.query.action,
      from: req.query.from,
      to: req.query.to,
      skip,
      limit,
    });
    ApiResponse.paginated(res, items, buildMeta(page, limit, total));
  }),

  recent: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.auditService.recent(Number(req.query.limit) || 10));
  }),
};
