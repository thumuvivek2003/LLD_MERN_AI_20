import { CHAT_TYPES } from './chat.constants.js';
import * as chatRepo from './chat.repository.js';
import { GROUP_ROLES } from '../../shared/constants/roles.constant.js';

/**
 * Factory pattern: chooses the right creation strategy by chat type.
 * Keeps service layer free from giant if/else.
 */
export async function createDirectChat({ userIdA, userIdB }) {
  const directKey = chatRepo.buildDirectKey(userIdA, userIdB);
  const existing = await chatRepo.findDirectChatByKey(directKey);
  if (existing) return existing;

  const chat = await chatRepo.create({
    type: CHAT_TYPES.DIRECT,
    name: null,
    createdBy: userIdA,
    directKey,
  });
  // Both users are MEMBERS of a direct chat.
  await chatRepo.addMember(chat._id, userIdA, GROUP_ROLES.MEMBER);
  await chatRepo.addMember(chat._id, userIdB, GROUP_ROLES.MEMBER);
  return chat.toObject ? chat.toObject() : chat;
}

export async function createGroupChat({ name, createdBy, memberIds }) {
  const chat = await chatRepo.create({
    type: CHAT_TYPES.GROUP,
    name,
    createdBy,
  });
  // Creator is ADMIN of the group.
  await chatRepo.addMember(chat._id, createdBy, GROUP_ROLES.ADMIN);
  for (const uid of memberIds || []) {
    if (String(uid) === String(createdBy)) continue;
    await chatRepo.addMember(chat._id, uid, GROUP_ROLES.MEMBER);
  }
  return chat.toObject ? chat.toObject() : chat;
}
