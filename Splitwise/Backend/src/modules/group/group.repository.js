import { GroupModel } from "./group.model.js";

export async function createGroup(data) {
  return GroupModel.create(data);
}

export async function findGroupById(groupId) {
  return GroupModel.findOne({ groupId });
}

export async function listGroups() {
  return GroupModel.find().sort({ createdAt: -1 });
}

export async function listGroupsForUser(userId) {
  return GroupModel.find({ "members.userId": userId }).sort({ updatedAt: -1 });
}

export async function saveGroup(doc) {
  return doc.save();
}
