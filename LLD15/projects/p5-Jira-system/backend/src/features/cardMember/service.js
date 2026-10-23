import {
  assignMemberRepo,
  unassignMemberRepo,
  getAssignedMembersRepo,
} from "./repository.js";

export const assignMemberService = (data) =>
  assignMemberRepo(data);

export const unassignMemberService = (cardId, userId) =>
  unassignMemberRepo(cardId, userId);

export const getAssignedMembersService = (cardId) =>
  getAssignedMembersRepo(cardId);