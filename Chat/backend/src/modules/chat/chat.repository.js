import mongoose from 'mongoose';
import { ChatModel } from '../../models/chat.model.js';
import { ChatMemberModel } from '../../models/group-member.model.js';
import { CHAT_TYPES } from './chat.constants.js';

export function create(doc) {
  return ChatModel.create(doc);
}

export function findById(id) {
  return ChatModel.findById(id).lean();
}

export function findDirectChatByKey(directKey) {
  return ChatModel.findOne({ type: CHAT_TYPES.DIRECT, directKey }).lean();
}

export function updateLastMessageAt(chatId, when = new Date()) {
  return ChatModel.findByIdAndUpdate(chatId, { lastMessageAt: when }, { new: true }).lean();
}

export function renameGroup(chatId, name) {
  return ChatModel.findByIdAndUpdate(chatId, { name }, { new: true }).lean();
}

export async function addMember(chatId, userId, role = 'MEMBER') {
  return ChatMemberModel.findOneAndUpdate(
    { chatId, userId },
    { $setOnInsert: { chatId, userId, role } },
    { upsert: true, new: true }
  ).lean();
}

export function removeMember(chatId, userId) {
  return ChatMemberModel.findOneAndDelete({ chatId, userId }).lean();
}

export function getMembers(chatId) {
  return ChatMemberModel.find({ chatId }).lean();
}

export function getMembership(chatId, userId) {
  return ChatMemberModel.findOne({ chatId, userId }).lean();
}

export function findUserChats(userId) {
  return ChatMemberModel.find({ userId }).select('chatId').lean();
}

export async function findChatsForUser(userId) {
  // Returns chat docs sorted by lastMessageAt desc (fallback updatedAt).
  const memberships = await ChatMemberModel.find({ userId }).select('chatId').lean();
  const chatIds = memberships.map((m) => m.chatId);
  if (!chatIds.length) return [];
  return ChatModel.find({ _id: { $in: chatIds } })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .lean();
}

export function setLastReadAt(chatId, userId, when = new Date()) {
  return ChatMemberModel.findOneAndUpdate(
    { chatId, userId },
    { lastReadAt: when },
    { new: true }
  ).lean();
}

export function buildDirectKey(userIdA, userIdB) {
  const a = String(userIdA);
  const b = String(userIdB);
  return [a, b].sort().join(':');
}

export function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

export function countAll() {
  return ChatModel.countDocuments();
}

export function countGroups() {
  return ChatModel.countDocuments({ type: CHAT_TYPES.GROUP });
}

export function findAllGroups() {
  return ChatModel.find({ type: CHAT_TYPES.GROUP }).sort({ createdAt: -1 }).lean();
}
