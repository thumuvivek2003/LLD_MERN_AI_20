import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../core/errors/AppError.js";
import * as userRepo from "./user.repository.js";
import { toUserDTO } from "./user.model.js";

export async function createUser({ name, email }) {
  if (!name || typeof name !== "string" || !name.trim()) {
    throw new AppError("VALIDATION_ERROR", 400, "name is required");
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new AppError("VALIDATION_ERROR", 400, "email is required");
  }

  const existing = await userRepo.findUserByEmail(email);
  if (existing) {
    return toUserDTO(existing);
  }

  const doc = await userRepo.createUser({
    userId: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
  });
  return toUserDTO(doc);
}

export async function getUserProfile(userId) {
  const doc = await userRepo.findUserById(userId);
  if (!doc) throw new AppError("USER_NOT_FOUND", 404, "User not found");
  return toUserDTO(doc);
}

export async function listUsers() {
  const docs = await userRepo.listUsers();
  return docs.map(toUserDTO);
}

export async function validateUsersExist(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];
  const docs = await userRepo.findUsersByIds(userIds);
  if (docs.length !== userIds.length) {
    throw new AppError("USER_NOT_FOUND", 404, "One or more users not found");
  }
  return docs;
}
