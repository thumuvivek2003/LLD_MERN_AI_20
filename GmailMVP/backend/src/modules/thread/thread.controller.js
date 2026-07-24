import * as threadService from './thread.service.js';
import { asyncHandler } from '../../shared/utils/async-handler.util.js';
import { ok } from '../../shared/utils/response.util.js';

export const getThread = asyncHandler(async (req, res) => {
  const { userId } = req.query; // optional viewer context
  const thread = await threadService.getConversation(req.params.id, userId);
  ok(res, thread);
});
