import { BaseRepository, LEAN } from '../../core/base/base.repository.js';
import { PermissionModel } from './permission.model.js';
import { RoleModel } from './role.model.js';

export class PermissionRepository extends BaseRepository {
  constructor(model = PermissionModel) {
    super(model);
  }

  findByRoleId(roleId) {
    return this.model.findOne({ roleId }).lean();
  }

  upsertForRole(roleId, objects, fields) {
    return this.model
      .findOneAndUpdate({ roleId }, { roleId, objects, fields }, { new: true, upsert: true })
      .lean();
  }

  deleteByRoleId(roleId) {
    return this.model.deleteOne({ roleId });
  }

  listAll() {
    return this.model.find({}).lean();
  }
}

export class RoleRepository extends BaseRepository {
  constructor(model = RoleModel) {
    super(model);
  }

  findByRoleId(roleId) {
    return this.model.findOne({ roleId }).lean();
  }

  listAll() {
    return this.model.find({}, LEAN).sort({ createdAt: 1 }).lean();
  }

  updateByRoleId(roleId, update) {
    return this.model.findOneAndUpdate({ roleId }, update, { new: true }).lean();
  }

  deleteByRoleId(roleId) {
    return this.model.findOneAndDelete({ roleId }).lean();
  }
}
