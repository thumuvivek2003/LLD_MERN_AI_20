import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatHeader } from './ChatHeader.jsx';
import { MessageBubble } from './MessageBubble.jsx';
import { MessageInput } from './MessageInput.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { useMessages } from '../hooks/useMessages.js';
import { useTyping } from '../hooks/useTyping.js';
import { useChatStore } from '../store/chat.store.js';
import { useMessageStore } from '../store/message.store.js';
import { useUserStore } from '../../user/store/user.store.js';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { useSocket } from '../../socket/socket.context.js';
import { resolveChatStrategy } from '../strategies/index.js';
import {
  emitChatJoin,
  emitChatLeave,
  emitMessage,
  emitReadReceipt,
  emitTypingStart,
  emitTypingStop,
} from '../../socket/socket.emitter.js';
import { CHAT_TYPES, MESSAGE_STATUS } from '../../../shared/constants/socket.constant.js';
import { markChatReadAll } from '../services/message.service.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

/**
 * Common UI for both DirectChatPage and GroupChatPage. The page wrappers
 * only enforce which chat type they render; everything below adapts via
 * the chat strategy.
 */
export function ChatThread({ expectedType }) {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const chat = useChatStore((s) => s.getChatById(chatId));
  const clearUnread = useChatStore((s) => s.clearUnread);
  const appendMessage = useMessageStore((s) => s.appendMessage);
  const markChatRead = useMessageStore((s) => s.markChatRead);
  const onlineIds = useUserStore((s) => s.onlineIds);
  const lastSeenMap = useUserStore((s) => s.lastSeenMap);
  const socket = useSocket();

  const { messages, loading, loadingMore, hasMore, loadMore } =
    useMessages(chatId);

  const { onKeystroke, typingUsers } = useTyping({
    chatId,
    emitStart: (p) => emitTypingStart(socket, p),
    emitStop: (p) => emitTypingStop(socket, p),
  });

  // If user landed on the wrong page type, redirect them.
  useEffect(() => {
    if (chat && expectedType && chat.type !== expectedType) {
      navigate(ROUTES.CHAT_DETAIL(chat.id), { replace: true });
    }
  }, [chat, expectedType, navigate]);

  // Join the socket.io room while viewing.
  useEffect(() => {
    if (!socket || !chatId) return;
    emitChatJoin(socket, { chatId });
    return () => emitChatLeave(socket, { chatId });
  }, [socket, chatId]);

  // Mark all as read when chat is opened (and again whenever new messages arrive while focused).
  useEffect(() => {
    if (!chatId || !currentUser) return;
    clearUnread(chatId);
    markChatRead(chatId, currentUser.id);
    // Best-effort REST + socket bulk read
    emitReadReceipt(socket, { chatId });
    markChatReadAll(chatId).catch(() => {});
  }, [chatId, currentUser, socket, clearUnread, markChatRead, messages.length]);

  // Auto-scroll to bottom on new messages.
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, chatId]);

  function handleSend(content) {
    if (!chatId || !content) return;
    const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const optimistic = {
      tempId,
      chatId,
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      content,
      createdAt: new Date().toISOString(),
      status: MESSAGE_STATUS.SENT,
      statuses: [],
    };
    appendMessage(chatId, optimistic);
    emitMessage(socket, { chatId, content, tempId });
  }

  const strategy = resolveChatStrategy(chat || { type: expectedType });
  const meta = chat
    ? strategy.render({
        chat,
        currentUserId: currentUser?.id,
        isOnline: (id) => onlineIds.has(id),
        getLastSeen: (id) => lastSeenMap[id] || null,
      })
    : { title: 'Chat', subtitle: '', avatarSeed: 'C', online: false, headerClickable: false, isGroup: expectedType === CHAT_TYPES.GROUP };

  // Filter typingUsers to exclude self
  const remoteTyping = useMemo(
    () => typingUsers.filter((u) => u.userId !== currentUser?.id),
    [typingUsers, currentUser]
  );

  return (
    <div className="flex h-full w-full flex-col bg-wa-chatBg bg-chat-pattern">
      <ChatHeader
        chat={chat}
        meta={meta}
        typingUsers={remoteTyping}
      />
      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 overflow-y-auto px-3 py-3"
      >
        {loading && messages.length === 0 ? (
          <Loader label="Loading messages" />
        ) : null}
        {hasMore && messages.length > 0 ? (
          <div className="mb-3 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-full bg-white/80 px-3 py-1 text-xs text-wa-muted shadow-sm hover:bg-white"
            >
              {loadingMore ? 'Loading...' : 'Load older'}
            </button>
          </div>
        ) : null}
        {!loading && messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            subtitle="Send the first message to start the conversation."
          />
        ) : null}
        <div className="flex flex-col gap-1.5">
          {messages.map((m) => (
            <MessageBubble
              key={m.id || m.tempId}
              message={m}
              isMine={m.senderId === currentUser?.id}
              showSender={meta.isGroup}
            />
          ))}
        </div>
      </div>
      <MessageInput
        onSend={handleSend}
        onKeystroke={onKeystroke}
        disabled={!chatId}
      />
    </div>
  );
}
