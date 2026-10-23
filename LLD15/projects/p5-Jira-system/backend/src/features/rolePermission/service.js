import {
  addPermissionRepo,
  removePermissionRepo,
  getPermissionsByRoleRepo,
} from "./repository.js";

export const addPermissionToRoleService = (data) =>
  addPermissionRepo(data);

export const removePermissionFromRoleService = (roleId, permissionId) =>
  removePermissionRepo(roleId, permissionId);

export const getPermissionsByRoleService = (roleId) =>
  getPermissionsByRoleRepo(roleId);