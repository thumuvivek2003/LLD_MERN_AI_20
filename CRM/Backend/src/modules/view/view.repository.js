import { BaseRepository, LEAN } from '../../core/base/base.repository.js';
import { SavedViewModel } from './view.model.js';

export class ViewRepository extends BaseRepository {
  constructor(model = SavedViewModel) {
    super(model);
  }

  listForUser(userId, objectId) {
    const filter = { userId };
    if (objectId) filter.objectId = objectId;
    return this.model.find(filter, LEAN).sort({ isDefault: -1, createdAt: -1 }).lean();
  }

  findByViewId(viewId) {
    return this.model.findOne({ viewId }).lean();
  }

  updateByViewId(viewId, update) {
    return this.model.findOneAndUpdate({ viewId }, update, { new: true }).lean();
  }

  deleteByViewId(viewId) {
    return this.model.findOneAndDelete({ viewId }).lean();
  }

  clearDefault(userId, objectId) {
    return this.model.updateMany({ userId, objectId }, { isDefault: false });
  }
}
