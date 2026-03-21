import Permission from "./model.js";

export const createPermissionRepo = (data) =>
  Permission.create(data);

export const getPermissionsRepo = () =>
  Permission.find();