import { MESSAGE_STATUS, statusRank } from '../delivery/delivery.constants.js';

/**
 * Compute the status to display to a given viewer.
 * - For the sender: aggregate min(status) across recipients (or DIRECT recipient's status).
 * - For non-sender: the viewer's own status row.
 */
export function computeViewerStatus({ message, statuses, viewerUserId }) {
  if (!statuses || !statuses.length) return MESSAGE_STATUS.SENT;
  const senderIsViewer = String(message.senderId) === String(viewerUserId);
  if (senderIsViewer) {
    const recipientStatuses = statuses.filter(
      (s) => String(s.userId) !== String(message.senderId)
    );
    if (!recipientStatuses.length) return MESSAGE_STATUS.SENT;
    return recipientStatuses.reduce(
      (min, s) => (statusRank(s.status) < statusRank(min) ? s.status : min),
      MESSAGE_STATUS.READ
    );
  }
  const own = statuses.find((s) => String(s.userId) === String(viewerUserId));
  return own?.status || MESSAGE_STATUS.SENT;
}

/**
 * Build the public Message DTO per API_CONTRACT.md.
 */
export function toMessageResponse({ message, statuses = [], userMap = new Map(), viewerUserId }) {
  const sender = userMap.get(String(message.senderId));
  return {
    id: String(message._id),
    chatId: String(message.chatId),
    senderId: String(message.senderId),
    senderName: sender?.name || 'Unknown',
    content: message.content,
    createdAt: new Date(message.createdAt).toISOString(),
    status: computeViewerStatus({ message, statuses, viewerUserId }),
    statuses: statuses.map((s) => ({
      userId: String(s.userId),
      name: userMap.get(String(s.userId))?.name || 'Unknown',
      status: s.status,
      timestamp: new Date(s.timestamp || s.updatedAt || Date.now()).toISOString(),
    })),
  };
}
