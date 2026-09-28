import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { assertCreateFieldPayload, assertReorderPayload } from './field.validation.js';

export const fieldController = {
  /** Generated from the field-type registry — never a hardcoded list. */
  catalogue: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, req.container.fieldService.catalogue());
  }),

  list: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.fieldService.list(req.params.oid));
  }),

  add: asyncHandler(async (req, res) => {
    assertCreateFieldPayload(req.body);
    ApiResponse.created(res, await req.container.fieldService.add(req.params.oid, req.body, req.actor));
  }),

  patch: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.fieldService.patch(req.params.oid, req.params.fid, req.body, req.actor));
  }),

  remove: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.fieldService.remove(req.params.oid, req.params.fid, req.actor));
  }),

  reorder: asyncHandler(async (req, res) => {
    assertReorderPayload(req.body);
    ApiResponse.ok(res, await req.container.fieldService.reorder(req.params.oid, req.body.order, req.actor));
  }),
};
