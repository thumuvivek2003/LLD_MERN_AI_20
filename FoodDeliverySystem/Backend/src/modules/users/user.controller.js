import { userService } from './user.service.js';
import { successResponse } from '../../core/utils/response.util.js';

export const getUsers = async (req, res, next) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await userService.getAllUsers(filter);
    successResponse(res, users);
  } catch (err) { next(err); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.changeUserRole(req.params.id, req.body.role);
    successResponse(res, user, 'Role updated');
  } catch (err) { next(err); }
};

export const blockUser = async (req, res, next) => {
  try {
    const user = await userService.toggleBlockUser(req.params.id, req.body.isBlocked);
    successResponse(res, user, 'User updated');
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    successResponse(res, user);
  } catch (err) { next(err); }
};
