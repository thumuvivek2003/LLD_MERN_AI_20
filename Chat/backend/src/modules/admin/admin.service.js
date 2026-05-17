import * as adminRepo from './admin.repository.js';
import * as userRepo from '../user/user.repository.js';
import * as chatRepo from '../chat/chat.repository.js';
import * as messageRepo from '../message/message.repository.js';
import { ChatMemberModel } from '../../models/group-member.model.js';
import { AppError, ERROR_CODES } from '../../shared/constants/errors.constant.js';

export function fetchUsers() {
  return adminRepo.findUsers();
}

export async function fetchUserById(id) {
  const user = await adminRepo.findById(id);
  if (!user) throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');
  return user;
}

export async function updateUserStatus(id, isBlocked) {
  const updated = await adminRepo.updateBlockStatus(id, isBlocked);
  if (!updated) throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');
  return updated;
}

export async function fetchStats() {
  const [totalUsers, onlineUsers, totalChats, totalGroups, messagesToday] = await Promise.all([
    userRepo.countAll(),
    userRepo.countOnline(),
    chatRepo.countAll(),
    chatRepo.countGroups(),
    messageRepo.countToday(),
  ]);
  return { totalUsers, onlineUsers, totalChats, totalGroups, messagesToday };
}

export async function fetchGroups() {
  const groups = await chatRepo.findAllGroups();
  const result = [];
  for (const g of groups) {
    const memberCount = await ChatMemberModel.countDocuments({ chatId: g._id });
    result.push({
      id: String(g._id),
      name: g.name,
      createdBy: String(g.createdBy),
      memberCount,
      createdAt: g.createdAt ? new Date(g.createdAt).toISOString() : null,
    });
  }
  return result;
}
