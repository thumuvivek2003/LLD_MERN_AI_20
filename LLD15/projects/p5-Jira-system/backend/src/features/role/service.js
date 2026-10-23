import { createRoleRepo, getRolesRepo } from "./repository.js";

export const createRoleService = (data) =>
  createRoleRepo(data);

export const getRolesService = () => getRolesRepo();