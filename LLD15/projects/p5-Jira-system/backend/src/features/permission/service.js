import {
  createPermissionRepo,
  getPermissionsRepo,
} from "./repository.js";

export const createPermissionService = (data) =>
  createPermissionRepo(data);

export const getPermissionsService = () =>
  getPermissionsRepo();