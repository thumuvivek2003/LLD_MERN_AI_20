import Role from "./model.js";

export const createRoleRepo = (data) => Role.create(data);
export const getRolesRepo = () => Role.find();