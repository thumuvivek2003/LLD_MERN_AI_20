import * as mailService from './mail.service.js';
import { validateSend, validateReply } from './mail.validator.js';
import { asyncHandler } from '../../shared/utils/async-handler.util.js';
import { ok, fail } from '../../shared/utils/response.util.js';

export const sendMail = asyncHandler(async (req, res) => {
  const dto = validateSend(req.body);
  const mail = await mailService.send(dto);
  ok(res, mail, 201);
});

export const getInbox = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) return fail(res, 400, 'userId query param is required', 'MISSING_USER_ID');
  const mails = await mailService.getInbox(userId);
  ok(res, mails);
});

export const getSent = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) return fail(res, 400, 'userId query param is required', 'MISSING_USER_ID');
  const mails = await mailService.getSent(userId);
  ok(res, mails);
});

export const getMail = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const mail = await mailService.getMail(req.params.id, userId);
  ok(res, mail);
});

export const replyMail = asyncHandler(async (req, res) => {
  const dto = validateReply(req.body);
  const mail = await mailService.reply(req.params.id, dto);
  ok(res, mail, 201);
});
