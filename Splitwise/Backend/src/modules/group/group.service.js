import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../core/errors/AppError.js";
import * as groupRepo from "./group.repository.js";
import * as userRepo from "../user/user.repository.js";
import { toGroupDTO } from "./group.model.js";

async function loadUserOrThrow(userId) {
  if (!userId || typeof userId !== "string") {
    throw new AppError("VALIDATION_ERROR", 400, "userId is required");
  }
  const user = await userRepo.findUserById(userId);
  if (!user) throw new AppError("USER_NOT_FOUND", 404, "User not found");
  return user;
}

async function loadGroupOrThrow(groupId) {
  const group = await groupRepo.findGroupById(groupId);
  if (!group) throw new AppError("GROUP_NOT_FOUND", 404, "Group not found");
  return group;
}

export async function createGroup({ name, description, createdBy }) {
  if (!name || typeof name !== "string" || !name.trim()) {
    throw new AppError("VALIDATION_ERROR", 400, "name is required");
  }
  const creator = await loadUserOrThrow(createdBy);

  const doc = await groupRepo.createGroup({
    groupId: uuidv4(),
    name: name.trim(),
    description: (description || "").trim(),
    createdBy: creator.userId,
    members: [
      {
        userId: creator.userId,
        name: creator.name,
        role: "CREATOR",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    ],
  });
  return toGroupDTO(doc);
}

export async function listGroups({ userId } = {}) {
  const docs = userId
    ? await groupRepo.listGroupsForUser(userId)
    : await groupRepo.listGroups();
  return docs.map(toGroupDTO);
}

export async function getGroup(groupId) {
  const doc = await loadGroupOrThrow(groupId);
  return toGroupDTO(doc);
}

export async function editGroup(groupId, { name, description }) {
  const doc = await loadGroupOrThrow(groupId);
  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new AppError("VALIDATION_ERROR", 400, "name must be a non-empty string");
    }
    doc.name = name.trim();
  }
  if (description !== undefined) {
    doc.description = String(description).trim();
  }
  await groupRepo.saveGroup(doc);
  return toGroupDTO(doc);
}

export async function addMember(groupId, { userId }) {
  const group = await loadGroupOrThrow(groupId);
  const user = await loadUserOrThrow(userId);

  const existing = group.members.find((m) => m.userId === user.userId);
  if (existing) {
    if (existing.status === "INACTIVE") {
      existing.status = "ACTIVE";
      existing.joinedAt = new Date();
      await groupRepo.saveGroup(group);
    }
    return toGroupDTO(group);
  }

  group.members.push({
    userId: user.userId,
    name: user.name,
    role: "MEMBER",
    status: "ACTIVE",
    joinedAt: new Date(),
  });
  await groupRepo.saveGroup(group);
  return toGroupDTO(group);
}

export async function removeMember(groupId, userId) {
  const group = await loadGroupOrThrow(groupId);
  const member = group.members.find((m) => m.userId === userId);
  if (!member) {
    throw new AppError("NOT_A_MEMBER", 409, "User is not a member of this group");
  }
  member.status = "INACTIVE";
  await groupRepo.saveGroup(group);
  return toGroupDTO(group);
}

export async function leaveGroup(groupId, { userId }) {
  return removeMember(groupId, userId);
}

export async function ensureActiveMember(group, userId) {
  const m = group.members.find((x) => x.userId === userId && x.status === "ACTIVE");
  if (!m) throw new AppError("NOT_A_MEMBER", 409, "User is not an active member of this group");
  return m;
}

export { loadGroupOrThrow };
