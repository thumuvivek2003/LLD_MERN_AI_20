import { viewId as newViewId } from '../../core/utils/id.util.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';
import { PermissionError } from '../../core/exceptions/permission.error.js';

/** Saved views — a stored query spec per user per object. */
export class ViewService {
  constructor({ viewRepository, metadataCache }) {
    this.viewRepository = viewRepository;
    this.metadataCache = metadataCache;
  }

  list(objectId, actor) {
    return this.viewRepository.listForUser(actor.userId, objectId);
  }

  async create(body, actor) {
    if (!body?.name) throw new BadRequestError('name is required');
    if (!body?.objectId) throw new BadRequestError('objectId is required');
    if (!(await this.metadataCache.getObject(body.objectId))) throw new NotFoundError('Object', body.objectId);

    if (body.isDefault) await this.viewRepository.clearDefault(actor.userId, body.objectId);
    const doc = await this.viewRepository.create({
      viewId: newViewId(),
      name: body.name,
      objectId: body.objectId,
      userId: actor.userId,
      filters: body.filters || [],
      logic: body.logic || 'AND',
      sort: body.sort || null,
      columns: body.columns || [],
      isDefault: Boolean(body.isDefault),
    });
    return doc.toObject ? doc.toObject() : doc;
  }

  async #own(viewId, actor) {
    const view = await this.viewRepository.findByViewId(viewId);
    if (!view) throw new NotFoundError('View', viewId);
    if (view.userId !== actor.userId) throw new PermissionError('This saved view belongs to another user');
    return view;
  }

  async update(viewId, patch, actor) {
    const view = await this.#own(viewId, actor);
    if (patch.isDefault) await this.viewRepository.clearDefault(actor.userId, view.objectId);
    const update = {};
    for (const prop of ['name', 'filters', 'logic', 'sort', 'columns', 'isDefault']) {
      if (patch[prop] !== undefined) update[prop] = patch[prop];
    }
    return this.viewRepository.updateByViewId(viewId, { $set: update });
  }

  async remove(viewId, actor) {
    await this.#own(viewId, actor);
    await this.viewRepository.deleteByViewId(viewId);
    return { viewId, deleted: true };
  }
}
