import { CHAT_TYPES } from '../../chat/chat.constants.js';
import { directMessageStrategy } from './direct-message.strategy.js';
import { groupMessageStrategy } from './group-message.strategy.js';

/**
 * Strategy selector: returns the correct strategy for the chat type.
 */
export function selectMessageStrategy(chatType) {
  if (chatType === CHAT_TYPES.DIRECT) return directMessageStrategy;
  return groupMessageStrategy;
}
