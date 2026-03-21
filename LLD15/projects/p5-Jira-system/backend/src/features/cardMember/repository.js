import CardMember from "./model.js";

export const assignMemberRepo = (data) =>
  CardMember.create(data);

export const unassignMemberRepo = (cardId, userId) =>
  CardMember.findOneAndDelete({ cardId, userId });

export const getAssignedMembersRepo = (cardId) =>
  CardMember.find({ cardId }).populate("userId");