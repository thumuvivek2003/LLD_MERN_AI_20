import * as adminService from './admin.service.js';
import { toAdminUserResponse } from '../user/user.mapper.js';
import { successResponse } from '../../shared/utils/response.util.js';

export async function getStats(_req, res, next) {
  try {
    const stats = await adminService.fetchStats();
    return successResponse(res, stats);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(_req, res, next) {
  try {
    const users = await adminService.fetchUsers();
    return successResponse(res, users.map(toAdminUserResponse));
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await adminService.fetchUserById(req.params.id);
    return successResponse(res, toAdminUserResponse(user));
  } catch (err) {
    next(err);
  }
}

export async function blockUser(req, res, next) {
  try {
    const user = await adminService.updateUserStatus(req.params.id, true);
    return successResponse(res, toAdminUserResponse(user));
  } catch (err) {
    next(err);
  }
}

export async function unblockUser(req, res, next) {
  try {
    const user = await adminService.updateUserStatus(req.params.id, false);
    return successResponse(res, toAdminUserResponse(user));
  } catch (err) {
    next(err);
  }
}

export async function getGroups(_req, res, next) {
  try {
    const groups = await adminService.fetchGroups();
    return successResponse(res, groups);
  } catch (err) {
    next(err);
  }
}
