import { FIELD_ACCESS, OBJECT_PERMISSION } from '../../config/constants.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { ConflictError } from '../../core/exceptions/conflict.error.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';

const WILDCARD = '*';
const NO_ACCESS = { read: false, create: false, update: false, delete: false };

/**
 * Permission Engine.
 *
 * There is no `if (role === 'ADMIN')` anywhere in this codebase. An admin is
 * powerful because their stored matrix contains a `"*"` entry, not because code
 * checks their role name — which means a new role with the same matrix behaves
 * identically, and revoking admin rights is a data change.
 */
export class PermissionService {
  constructor({ permissionRepository, roleRepository, userRepository }) {
    this.permissionRepository = permissionRepository;
    this.roleRepository = roleRepository;
    this.userRepository = userRepository;
    this.matrixCache = new Map();
  }

  invalidate(roleId = null) {
    if (roleId) this.matrixCache.delete(roleId);
    else this.matrixCache.clear();
  }

  async matrixFor(roleId) {
    if (this.matrixCache.has(roleId)) return this.matrixCache.get(roleId);
    const doc = (await this.permissionRepository.findByRoleId(roleId)) || { roleId, objects: {}, fields: {} };
    const matrix = { roleId, objects: doc.objects || {}, fields: doc.fields || {} };
    this.matrixCache.set(roleId, matrix);
    return matrix;
  }

  /** Object-level CRUD. Specific entry wins; `"*"` is the role-wide fallback. */
  async objectPermissions(roleId, objectId) {
    const matrix = await this.matrixFor(roleId);
    return { ...NO_ACCESS, ...(matrix.objects[WILDCARD] || {}), ...(matrix.objects[objectId] || {}) };
  }

  async can(roleId, objectId, action) {
    if (!OBJECT_PERMISSION.includes(action)) throw new BadRequestError(`Unknown permission '${action}'`);
    const perms = await this.objectPermissions(roleId, objectId);
    return Boolean(perms[action]);
  }

  /** Field-level access map for one object: `{ f1: 'WRITE', f7: 'HIDDEN' }`. */
  async fieldAccess(roleId, objectDef) {
    const matrix = await this.matrixFor(roleId);
    const global = matrix.fields[WILDCARD] || {};
    const perObject = matrix.fields[objectDef.objectId] || {};
    const fallback = perObject[WILDCARD] || global[WILDCARD] || FIELD_ACCESS.WRITE;
    const out = {};
    for (const field of objectDef.fields || []) {
      out[field.fieldId] = perObject[field.fieldId] || fallback;
    }
    return out;
  }

  async fullMatrix(roleId) {
    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) throw new NotFoundError('Role', roleId);
    return this.matrixFor(roleId);
  }

  async replaceMatrix({ roleId, objects = {}, fields = {} }) {
    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) throw new NotFoundError('Role', roleId);
    const saved = await this.permissionRepository.upsertForRole(roleId, objects, fields);
    this.invalidate(roleId);
    return { roleId, objects: saved.objects, fields: saved.fields };
  }

  // ------------------------------------------------------------------- roles

  async listRoles() {
    const roles = await this.roleRepository.listAll();
    return Promise.all(
      roles.map(async (r) => ({
        roleId: r.roleId,
        name: r.name,
        description: r.description,
        isSystem: r.isSystem,
        userCount: await this.userRepository.countByRoleId(r.roleId),
      })),
    );
  }

  async createRole({ roleId, name, description }) {
    if (!name) throw new BadRequestError('Role name is required');
    const id = roleId || name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (await this.roleRepository.findByRoleId(id)) throw new ConflictError(`Role '${id}' already exists`);
    const role = await this.roleRepository.create({ roleId: id, name, description: description || '', isSystem: false });
    await this.permissionRepository.upsertForRole(id, {}, {});
    return role.toObject ? role.toObject() : role;
  }

  async updateRole(roleId, patch) {
    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) throw new NotFoundError('Role', roleId);
    const updated = await this.roleRepository.updateByRoleId(roleId, {
      name: patch.name ?? role.name,
      description: patch.description ?? role.description,
    });
    return updated;
  }

  async deleteRole(roleId) {
    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) throw new NotFoundError('Role', roleId);
    if (role.isSystem) throw new ConflictError('System roles cannot be deleted');
    const users = await this.userRepository.countByRoleId(roleId);
    if (users) throw new ConflictError(`Role '${roleId}' is assigned to ${users} user(s)`);
    await this.permissionRepository.deleteByRoleId(roleId);
    await this.roleRepository.deleteByRoleId(roleId);
    this.invalidate(roleId);
    return { roleId, deleted: true };
  }
}
