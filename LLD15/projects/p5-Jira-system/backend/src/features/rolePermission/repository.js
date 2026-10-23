import RolePermission from "./model.js";

export const addPermissionRepo = (data) =>
  RolePermission.create(data);

export const removePermissionRepo = (roleId, permissionId) =>
  RolePermission.findOneAndDelete({ roleId, permissionId });

export const getPermissionsByRoleRepo = (roleId) =>
  RolePermission.find({ roleId }).populate("permissionId");