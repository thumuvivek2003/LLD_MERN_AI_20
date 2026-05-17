/**
 * Strategy for rendering GROUP chat metadata (title, member list subtitle).
 */
export function render({ chat, currentUserId }) {
  const members = chat.members || [];
  const subtitleNames = members
    .map((m) => (m.userId === currentUserId ? 'You' : m.name))
    .slice(0, 4)
    .join(', ');
  const extra = members.length > 4 ? ` +${members.length - 4}` : '';
  return {
    title: chat.name || 'Group',
    subtitle: `${members.length} members • ${subtitleNames}${extra}`,
    avatarSeed: chat.name || 'G',
    online: false,
    isGroup: true,
    headerClickable: true,
  };
}
