import { ChatMemberModel } from '../../models/group-member.model.js';
import { ChatModel } from '../../models/chat.model.js';

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

export function renameGroup(chatId, name) {
  return ChatModel.findByIdAndUpdate(chatId, { name }, { new: true }).lean();
}
