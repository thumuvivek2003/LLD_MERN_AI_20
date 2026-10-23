import BoardMember from "./model.js";

export const addMemberRepo = (data) =>
  BoardMember.create(data);

export const updateRoleRepo = (boardId, userId, roleId) =>
  BoardMember.findOneAndUpdate(
    { boardId, userId },
    { roleId },
    { new: true }
  );

export const removeMemberRepo = (boardId, userId) =>
  BoardMember.findOneAndDelete({ boardId, userId });

export const getMembersRepo = (boardId) =>
  BoardMember.find({ boardId });