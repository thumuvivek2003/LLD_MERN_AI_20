import { useChats } from '../hooks/useChats.js';
import { ChatList } from '../components/ChatList.jsx';
import { useChatStore } from '../store/chat.store.js';

export function ChatHomePage() {
  const { loading } = useChats();
  const chats = useChatStore((s) => s.chats);
  return (
    <div className="flex h-full w-full">
      <div className="hidden h-full w-full max-w-md border-r border-wa-border md:block">
        <ChatList chats={chats} loading={loading} />
      </div>
      <div className="hidden flex-1 items-center justify-center bg-wa-chatBg bg-chat-pattern md:flex">
        <div className="rounded-lg bg-white/70 px-6 py-4 text-center text-sm text-wa-muted shadow">
          <div className="mb-1 text-base font-semibold text-wa-dark">
            Chat MVP
          </div>
          Pick a conversation on the left to start chatting.
        </div>
      </div>
      <div className="block h-full w-full md:hidden">
        <ChatList chats={chats} loading={loading} />
      </div>
    </div>
  );
}
