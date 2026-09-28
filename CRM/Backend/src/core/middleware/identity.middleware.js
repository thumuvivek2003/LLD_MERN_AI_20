import { PermissionError } from '../exceptions/permission.error.js';

/**
 * CONTRACT.md §2 — identity is the `x-user-id` header, no JWT.
 * Two routes are deliberately open so the user switcher and the health probe
 * can work before an identity exists.
 */
const OPEN_ROUTES = [
  { method: 'GET', path: '/users' },
  { method: 'GET', path: '/system/health' },
];

export function identityMiddleware(userRepository) {
  return async (req, _res, next) => {
    const isOpen = OPEN_ROUTES.some((r) => r.method === req.method && req.path === r.path);
    const userId = req.header('x-user-id');

    if (!userId) {
      if (isOpen) return next();
      return next(new PermissionError('Missing x-user-id header'));
    }

    const user = await userRepository.findByUserId(userId);
    if (!user) {
      if (isOpen) return next();
      return next(new PermissionError(`Unknown user '${userId}'`));
    }

    req.actor = { userId: user.userId, name: user.name, role: user.role, roleId: user.roleId };
    return next();
  };
}
