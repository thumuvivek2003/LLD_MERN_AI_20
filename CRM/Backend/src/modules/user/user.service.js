import { initials } from '../../core/utils/slug.util.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';

/** The user switcher (CONTRACT.md §2) — no auth, just identity. */
export class UserService {
  constructor({ userRepository, roleRepository, permissionService }) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.permissionService = permissionService;
  }

  async list() {
    const users = await this.userRepository.listAll();
    return users.map((u) => ({
      userId: u.userId,
      name: u.name,
      role: u.role,
      roleId: u.roleId,
      avatarInitials: u.avatarInitials || initials(u.name),
      title: u.title,
    }));
  }

  async me(actor) {
    const user = await this.userRepository.findByUserId(actor.userId);
    if (!user) throw new NotFoundError('User', actor.userId);
    const permissions = await this.permissionService.matrixFor(user.roleId);
    return {
      userId: user.userId,
      name: user.name,
      role: user.role,
      roleId: user.roleId,
      avatarInitials: user.avatarInitials || initials(user.name),
      title: user.title,
      permissions: { objects: permissions.objects, fields: permissions.fields },
    };
  }

  async assignRole(userId, roleId) {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) throw new NotFoundError('User', userId);
    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) throw new NotFoundError('Role', roleId);
    return this.userRepository.updateByUserId(userId, { roleId });
  }
}
