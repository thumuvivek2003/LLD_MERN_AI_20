import * as directStrategy from './direct-chat.strategy.js';
import * as groupStrategy from './group-chat.strategy.js';
import { CHAT_TYPES } from '../../../shared/constants/socket.constant.js';

/**
 * Resolve the correct chat-rendering strategy for a given chat type.
 */
export function resolveChatStrategy(chat) {
  if (chat?.type === CHAT_TYPES.GROUP) return groupStrategy;
  return directStrategy;
}
