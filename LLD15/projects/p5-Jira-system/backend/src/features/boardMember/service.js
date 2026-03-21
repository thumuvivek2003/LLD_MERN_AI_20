import {
  addMemberRepo,
  updateRoleRepo,
  removeMemberRepo,
  getMembersRepo,
} from "./repository.js";

export const addMemberService = (data) => addMemberRepo(data);

export const updateRoleService = (boardId, userId, roleId) =>
  updateRoleRepo(boardId, userId, roleId);

export const removeMemberService = (boardId, userId) =>
  removeMemberRepo(boardId, userId);

export const getMembersService = (boardId) =>
  getMembersRepo(boardId);