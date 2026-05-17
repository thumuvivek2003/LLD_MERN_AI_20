import { ChatThread } from '../components/ChatThread.jsx';
import { CHAT_TYPES } from '../../../shared/constants/socket.constant.js';

export function DirectChatPage() {
  return <ChatThread expectedType={CHAT_TYPES.DIRECT} />;
}
