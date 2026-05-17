/**
 * Strategy for rendering DIRECT chat metadata (title, subtitle, avatar seed).
 * The "other" member is the non-self member; we render their name/presence.
 */
export function render({ chat, currentUserId, isOnline, getLastSeen }) {
  const other =
    chat.members?.find((m) => m.userId !== currentUserId) || chat.members?.[0];

  const online = other ? isOnline(other.userId) || other.isOnline : false;
  const lastSeen = other ? getLastSeen(other.userId) || other.lastSeen : null;

  return {
    title: chat.name || other?.name || 'Direct chat',
    subtitle: online
      ? 'online'
      : lastSeen
      ? `last seen ${formatRel(lastSeen)}`
      : '',
    avatarSeed: chat.name || other?.name || 'D',
    online,
    isGroup: false,
    headerClickable: false,
  };
}

function formatRel(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}
