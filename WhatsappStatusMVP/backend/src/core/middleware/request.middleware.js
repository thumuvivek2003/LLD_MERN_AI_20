// core/middleware/request.middleware.js — attachCurrentUser()
// MVP "auth": the client sends its chosen userId in the `x-user-id` header.
// We look it up once and attach it to req.currentUser for downstream services.
import { userRepository } from '../../modules/user/user.repository.js';
import { UnauthorizedError } from '../errors/validation.error.js';

export function attachCurrentUser({ required = true } = {}) {
  return async (req, _res, next) => {
    try {
      const userId = req.header('x-user-id');
      if (!userId) {
        if (required) throw new UnauthorizedError('Missing x-user-id header (pick a user first)');
        return next();
      }
      const user = await userRepository.findById(userId);
      if (!user) throw new UnauthorizedError('Unknown user');
      req.currentUser = user;
      req.currentUserId = String(user._id);
      next();
    } catch (err) {
      next(err);
    }
  };
}
