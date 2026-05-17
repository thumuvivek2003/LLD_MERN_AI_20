import { ChatCard } from './ChatCard.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';

export function ChatList({ chats = [], loading }) {
  if (loading && chats.length === 0) return <Loader label="Loading chats" />;
  if (!loading && chats.length === 0) {
    return (
      <EmptyState
        title="No chats yet"
        subtitle="Start a new conversation from Contacts or New chat"
      />
    );
  }
  return (
    <div className="scrollbar-thin h-full overflow-y-auto bg-white">
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
