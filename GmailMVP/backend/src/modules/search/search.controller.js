import * as searchService from './search.service.js';
import { asyncHandler } from '../../shared/utils/async-handler.util.js';
import { ok, fail } from '../../shared/utils/response.util.js';
import { SEARCH_TYPES } from '../../shared/constants/search-types.constant.js';

export const searchMails = asyncHandler(async (req, res) => {
  const { userId, q, type } = req.query;
  if (!userId) return fail(res, 400, 'userId query param is required', 'MISSING_USER_ID');
  const results = await searchService.search(userId, q || '', type || SEARCH_TYPES.ALL);
  ok(res, results);
});
