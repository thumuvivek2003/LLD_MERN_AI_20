import { QueryParser } from './query.parser.js';
import { QueryOptimizer } from './query.optimizer.js';
import { fieldTypeRegistry } from '../field/types/field-type.registry.js';
import { RECORD_STATUS } from '../../config/constants.js';

/**
 * Query Executor — parse → optimize → execute → sort → paginate → fetch.
 *
 * Two guarantees the contract depends on:
 *  1. `plan` is measured, never decorative: every `matched` is a real set size
 *     and `tookMs` is a real hrtime delta.
 *  2. When an index exists it is used. A collection read only happens for the
 *     final page of records, or as an explicit residual/scan step that the plan
 *     admits to.
 */
export class QueryExecutor {
  constructor({ indexManager, recordRepository }) {
    this.indexManager = indexManager;
    this.recordRepository = recordRepository;
  }

  async execute(objectDef, spec) {
    const started = process.hrtime.bigint();
    const objectId = objectDef.objectId;
    const rowCount = await this.recordRepository.countByObject(objectId, RECORD_STATUS.ACTIVE);
    const plan = { strategy: 'PAGED_SCAN', tookMs: 0, scanned: 0, steps: [] };

    if (!spec.filters?.length) {
      const result = await this.#unfiltered(objectDef, spec, rowCount, plan);
      plan.tookMs = QueryExecutor.#ms(started);
      return result;
    }

    const tree = QueryParser.parse(spec, objectDef);
    QueryOptimizer.optimize(tree, { indexManager: this.indexManager, objectDef, rowCount });

    const ctx = {
      objectDef,
      indexManager: this.indexManager,
      plan,
      residuals: [],
      indexedPredicates: 0,
      residualPredicates: 0,
      unionOps: 0,
    };

    let ids = await tree.execute(ctx);
    let loaded = null; // Map<recordId, recordJson> once we have had to read records

    if (ids === null) {
      const all = await this.recordRepository.allActiveIds(objectId);
      ids = new Set(all);
      plan.steps.push({ op: 'SCAN', matched: ids.size, detail: 'no usable index for any predicate' });
    }

    let matchedIds = [...ids];

    if (ctx.residuals.length) {
      const rows = await this.recordRepository.findManyByIds(matchedIds, { recordId: 1, recordJson: 1, _id: 0 });
      loaded = new Map(rows.map((r) => [r.recordId, r.recordJson]));
      plan.scanned = rows.length;
      matchedIds = rows
        .filter((r) => ctx.residuals.every((predicate) => predicate(r.recordJson)))
        .map((r) => r.recordId);
      plan.steps.push({ op: 'RESIDUAL_FILTER', scanned: rows.length, matched: matchedIds.length });
    }

    plan.strategy = QueryExecutor.#strategyName(ctx);
    plan.explain = tree.explain();

    const ordered = await this.#sort(objectDef, matchedIds, spec.sort, plan, loaded);
    const total = ordered.length;
    const pageIds = ordered.slice((spec.page - 1) * spec.limit, spec.page * spec.limit);
    const records = await this.#fetchOrdered(pageIds);

    plan.tookMs = QueryExecutor.#ms(started);
    return { records, total, plan };
  }

  // ------------------------------------------------------------------ helpers

  async #unfiltered(objectDef, spec, rowCount, plan) {
    const objectId = objectDef.objectId;

    if (spec.sort?.fieldId) {
      const orderedAll = this.indexManager.sortedIds(objectId, spec.sort.fieldId, spec.sort.order);
      if (orderedAll) {
        plan.strategy = 'INDEX_ORDER_SCAN';
        plan.steps.push({ fieldId: spec.sort.fieldId, index: 'BTREE', op: 'SORT', matched: orderedAll.length });
        const pageIds = orderedAll.slice((spec.page - 1) * spec.limit, spec.page * spec.limit);
        return { records: await this.#fetchOrdered(pageIds), total: orderedAll.length, plan };
      }
    }

    const sortSpec = spec.sort?.fieldId
      ? { [`recordJson.${spec.sort.fieldId}`]: spec.sort.order === 'desc' ? -1 : 1 }
      : { createdAt: -1 };
    const [records, total] = await this.recordRepository.listByObject(objectId, {
      status: spec.status || RECORD_STATUS.ACTIVE,
      skip: (spec.page - 1) * spec.limit,
      limit: spec.limit,
      sort: sortSpec,
    });
    plan.scanned = records.length;
    plan.steps.push({ op: 'PAGE', matched: records.length, detail: 'no filters — paged read from record store' });
    return { records, total: total ?? rowCount, plan };
  }

  async #sort(objectDef, ids, sort, plan, loaded) {
    if (!sort?.fieldId) {
      // recordIds are ULIDs, so descending id order is newest-first for free.
      return ids.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    }

    const field = objectDef.fields.find((f) => f.fieldId === sort.fieldId);
    if (!field) return ids;

    const orderedAll = this.indexManager.sortedIds(objectDef.objectId, sort.fieldId, sort.order);
    if (orderedAll) {
      const wanted = new Set(ids);
      const out = orderedAll.filter((id) => wanted.has(id));
      plan.steps.push({ op: 'SORT', fieldId: sort.fieldId, index: 'BTREE', matched: out.length });
      return out;
    }

    let values = loaded;
    if (!values) {
      const rows = await this.recordRepository.findManyByIds(ids, { recordId: 1, recordJson: 1, _id: 0 });
      values = new Map(rows.map((r) => [r.recordId, r.recordJson]));
      plan.scanned += rows.length;
    }
    const descriptor = fieldTypeRegistry.get(field.type);
    const dir = sort.order === 'desc' ? -1 : 1;
    const out = [...ids].sort((a, b) => {
      const av = descriptor.sortValue(values.get(a)?.[sort.fieldId]);
      const bv = descriptor.sortValue(values.get(b)?.[sort.fieldId]);
      if (av === bv) return 0;
      return av < bv ? -dir : dir;
    });
    plan.steps.push({ op: 'SORT', fieldId: sort.fieldId, index: 'NONE', matched: out.length });
    return out;
  }

  async #fetchOrdered(pageIds) {
    if (!pageIds.length) return [];
    const rows = await this.recordRepository.findManyByIds(pageIds);
    const byId = new Map(rows.map((r) => [r.recordId, r]));
    return pageIds.map((id) => byId.get(id)).filter(Boolean);
  }

  static #strategyName({ indexedPredicates, residualPredicates, unionOps }) {
    if (indexedPredicates && residualPredicates) return 'HYBRID';
    if (unionOps && indexedPredicates > 1) return 'INDEX_UNION';
    if (indexedPredicates > 1) return 'INDEX_INTERSECTION';
    if (indexedPredicates === 1) return 'INDEX_SCAN';
    return 'FULL_SCAN';
  }

  static #ms(started) {
    return Math.round((Number(process.hrtime.bigint() - started) / 1e6) * 1000) / 1000;
  }
}
