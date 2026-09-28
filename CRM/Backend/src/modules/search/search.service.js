import { QueryBuilder } from '../query/query.builder.js';
import { RecordMapper } from '../record/record.mapper.js';
import { FieldAccessMapper } from '../permission/field-access.mapper.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';

/**
 * Search module — the HTTP-facing façade over the Query Engine.
 *
 * It owns request shaping, permissions and response mapping. It owns no query
 * logic: swapping the executor for an Elasticsearch-backed one would leave this
 * file untouched, which is the Dependency Inversion point chat.md asks for.
 */
export class SearchService {
  constructor({ metadataCache, queryExecutor, indexManager, permissionService, lookupResolver }) {
    this.metadataCache = metadataCache;
    this.queryExecutor = queryExecutor;
    this.indexManager = indexManager;
    this.permissionService = permissionService;
    this.lookupResolver = lookupResolver;
  }

  async search(body, actor) {
    if (!body?.objectId) throw new BadRequestError('objectId is required');
    const objectDef = await this.metadataCache.getObject(body.objectId);
    if (!objectDef) throw new NotFoundError('Object', body.objectId);

    const access = await this.permissionService.fieldAccess(actor.roleId, objectDef);
    const visible = new Set(FieldAccessMapper.visibleFieldIds(objectDef.fields, access));

    const hiddenFilter = (body.filters || []).find((f) => !visible.has(f.fieldId));
    if (hiddenFilter) throw new NotFoundError('Field', hiddenFilter.fieldId);

    const spec = QueryBuilder.for(body.objectId)
      .withFilters(body.filters)
      .withLogic(body.logic)
      .sortBy(body.sort?.fieldId, body.sort?.order)
      .paginate(body.page, body.limit)
      .select(body.columns)
      .withStatus(body.status)
      .build();

    const { records, total, plan } = await this.queryExecutor.execute(objectDef, spec);
    const resolvedByRecord = await this.lookupResolver.resolveMany(objectDef, records);

    return {
      records: RecordMapper.toList(records, { access, resolvedByRecord }),
      plan,
      total,
      page: spec.page,
      limit: spec.limit,
    };
  }

  /** Type-ahead straight off the TRIE index. */
  async suggest({ objectId, fieldId, prefix, limit = 10 }) {
    if (!objectId || !fieldId) throw new BadRequestError('objectId and fieldId are required');
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);
    if (!objectDef.fields.some((f) => f.fieldId === fieldId)) throw new NotFoundError('Field', fieldId);
    return this.indexManager.suggest(objectId, fieldId, prefix || '', Number(limit) || 10);
  }
}
