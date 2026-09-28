import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';

export const permissionController = {
  listRoles: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.permissionService.listRoles());
  }),

  createRole: asyncHandler(async (req, res) => {
    ApiResponse.created(res, await req.container.permissionService.createRole(req.body));
  }),

  patchRole: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.permissionService.updateRole(req.params.roleId, req.body));
  }),

  deleteRole: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.permissionService.deleteRole(req.params.roleId));
  }),

  getMatrix: asyncHandler(async (req, res) => {
    const roleId = req.query.roleId || req.actor.roleId;
    ApiResponse.ok(res, await req.container.permissionService.fullMatrix(roleId));
  }),

  putMatrix: asyncHandler(async (req, res) => {
    if (!req.body?.roleId) throw new BadRequestError('roleId is required');
    ApiResponse.ok(res, await req.container.permissionService.replaceMatrix(req.body));
  }),
};
