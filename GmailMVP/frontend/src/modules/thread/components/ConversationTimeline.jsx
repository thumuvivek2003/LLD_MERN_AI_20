import ThreadItem from './ThreadItem.jsx';

/**
 * Renders the conversation oldest -> newest with a connecting vertical line.
 * The last message is expanded by default.
 */
export default function ConversationTimeline({ mails, currentUserId }) {
  return (
    <div className="relative flex flex-col gap-4">
      {/* Vertical connector */}
      {mails.length > 1 && (
        <span className="absolute bottom-4 left-[18px] top-4 w-px bg-slate-200" />
      )}
      {mails.map((mail, idx) => (
        <ThreadItem
          key={mail.id}
          mail={mail}
          isCurrentUser={mail.sender?.id === currentUserId}
          defaultOpen={idx === mails.length - 1}
        />
      ))}
    </div>
  );
}
