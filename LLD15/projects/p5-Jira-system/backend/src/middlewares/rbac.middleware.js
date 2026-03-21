import RolePermission from "../features/rolePermission/model.js";

const rbac = (requiredPermission) => {
  return async (req, res, next) => {
    const user = req.user;

    // assume user has roleId (attach in token ideally)
    //If Permissions from backend
    // const roleId = user.roleId;

    // const permissions = await RolePermission.find({ roleId })
    //   .populate("permissionId");

    // const permissionNames = permissions.map(
    //   (p) => p.permissionId.name
    // );

    //If after login store them in cache jwt 
    permissionNames = req.user.permissions;
    if (!permissionNames.includes(requiredPermission)) {
      return next({
        status: 403,
        message: "Forbidden",
      });
    }

    next();
  };
};

export default rbac;