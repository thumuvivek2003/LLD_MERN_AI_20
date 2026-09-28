import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { parsePagination, buildMeta } from '../../core/utils/pagination.util.js';
import { assertCreateObjectPayload, assertClonePayload } from './object.validation.js';
import { OBJECT_STATUS } from '../../config/constants.js';

export const objectController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { objectService, permissionService } = req.container;
    const { items, total } = await objectService.list({
      q: req.query.q,
      status: req.query.status,
      sort: req.query.sort || 'label',
      order: req.query.order || 'asc',
      page,
      limit,
      skip,
    });

    // Business users only see objects their role can read.
    const visible = [];
    for (const item of items) {
      if (await permissionService.can(req.actor.roleId, item.objectId, 'read')) visible.push(item);
    }
    ApiResponse.paginated(res, visible, buildMeta(page, limit, total));
  }),

  get: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.get(req.params.oid));
  }),

  stats: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.stats(req.params.oid));
  }),

  versions: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.versions(req.params.oid));
  }),

  create: asyncHandler(async (req, res) => {
    assertCreateObjectPayload(req.body);
    ApiResponse.created(res, await req.container.objectService.create(req.body, req.actor));
  }),

  patch: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.patch(req.params.oid, req.body, req.actor));
  }),

  publish: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.transition(req.params.oid, OBJECT_STATUS.PUBLISHED, req.actor));
  }),

  archive: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.transition(req.params.oid, OBJECT_STATUS.ARCHIVED, req.actor));
  }),

  restore: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.transition(req.params.oid, OBJECT_STATUS.PUBLISHED, req.actor));
  }),

  clone: asyncHandler(async (req, res) => {
    assertClonePayload(req.body);
    ApiResponse.created(res, await req.container.objectService.clone(req.params.oid, req.body, req.actor));
  }),

  remove: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.remove(req.params.oid, req.actor));
  }),

  referencedBy: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.objectService.referencedBy(req.params.oid));
  }),
};
