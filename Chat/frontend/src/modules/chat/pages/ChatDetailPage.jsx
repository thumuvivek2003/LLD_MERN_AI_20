import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatThread } from '../components/ChatThread.jsx';
import { useChatStore } from '../store/chat.store.js';
import { fetchChatById } from '../services/chat.service.js';

/**
 * Single route entrypoint for /chats/:chatId.
 * Loads chat metadata if missing and lets ChatThread render via strategy.
 */
export function ChatDetailPage() {
  const { chatId } = useParams();
  const chat = useChatStore((s) => s.getChatById(chatId));
  const upsertChat = useChatStore((s) => s.upsertChat);

  useEffect(() => {
    if (chatId && !chat) {
      fetchChatById(chatId)
        .then((data) => {
          if (data) upsertChat(data);
        })
        .catch(() => {});
    }
  }, [chatId, chat, upsertChat]);

  return <ChatThread />;
}
