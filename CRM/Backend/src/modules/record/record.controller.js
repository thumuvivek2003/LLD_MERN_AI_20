import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { parsePagination, buildMeta } from '../../core/utils/pagination.util.js';

export const recordController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit } = parsePagination(req.query);
    const { items, total, plan } = await req.container.recordService.list(
      req.params.oid,
      { ...req.query, page, limit },
      req.actor,
    );
    // `data` stays an array like every other paginated list in the contract;
    // the query plan rides along in `meta` for the "how fast / why" UI.
    res.json({ success: true, data: items, meta: { ...buildMeta(page, limit, total), plan } });
  }),

  get: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.recordService.get(req.params.oid, req.params.rid, req.actor));
  }),

  create: asyncHandler(async (req, res) => {
    ApiResponse.created(res, await req.container.recordService.create(req.params.oid, req.body, req.actor));
  }),

  patch: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.recordService.update(req.params.oid, req.params.rid, req.body, req.actor));
  }),

  archive: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.recordService.archive(req.params.oid, req.params.rid, req.actor));
  }),

  restore: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.recordService.restore(req.params.oid, req.params.rid, req.actor));
  }),

  related: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.relationshipService.relatedFor(req.params.oid, req.params.rid));
  }),

  history: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { items, total } = await req.container.recordService.history(req.params.oid, req.params.rid, { skip, limit });
    ApiResponse.paginated(res, items, buildMeta(page, limit, total));
  }),

  bulk: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.recordBulkService.bulk(req.params.oid, req.body, req.actor));
  }),

  import: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.recordBulkService.import(req.params.oid, req.body, req.actor));
  }),

  importSample: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.recordBulkService.sample(req.params.oid, req.actor));
  }),

  export: asyncHandler(async (req, res) => {
    const split = (v) => (v ? String(v).split(',').filter(Boolean) : null);
    const result = await req.container.recordExportService.export(
      req.params.oid,
      {
        format: req.query.format === 'json' ? 'json' : 'csv',
        fieldIds: split(req.query.fieldIds),
        recordIds: split(req.query.recordIds),
        status: req.query.status,
      },
      req.actor,
    );
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.body);
  }),
};
