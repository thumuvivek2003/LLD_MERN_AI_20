import { ReadState } from '../state/ReadState.js';
import { UnreadState } from '../state/UnreadState.js';
import {
  initials,
  formatDate,
  relativeTime,
  fullDate,
  snippetOf,
} from '../utils/formatter.js';

/**
 * Factory pattern: converts a raw MailDTO from the API into a UI-ready
 * view model (formatted times, initials, snippet, presentation state).
 */
export const MailViewModelFactory = {
  fromDTO(dto, { context = 'inbox' } = {}) {
    if (!dto) return null;

    const sender = dto.sender || {};
    const receivers = Array.isArray(dto.receivers) ? dto.receivers : [];
    const isRead = dto.isRead ?? dto.status === 'READ';
    const state = isRead ? new ReadState() : new UnreadState();

    // In "sent"/"thread" contexts we always render as read (own mail).
    const effectiveState = context === 'sent' ? new ReadState() : state;

    return {
      id: dto.id,
      threadId: dto.threadId,
      subject: dto.subject || '(no subject)',
      body: dto.body || '',
      snippet: dto.snippet || snippetOf(dto.body || ''),
      timestamp: dto.timestamp,
      status: dto.status,
      isRead,

      sender: {
        ...sender,
        initials: initials(sender.name),
        color: sender.avatarColor || '#6366f1',
      },
      receivers: receivers.map((r) => ({
        ...r,
        initials: initials(r.name),
        color: r.avatarColor || '#6366f1',
      })),
      receiverNames: receivers.map((r) => r.name).join(', '),

      // formatted times
      shortTime: formatDate(dto.timestamp),
      relTime: relativeTime(dto.timestamp),
      fullTime: fullDate(dto.timestamp),

      // presentation state (State pattern)
      state: effectiveState,
      emphasisClass: effectiveState.emphasisClass,
      subjectClass: effectiveState.subjectClass,
      showUnreadDot: effectiveState.showUnreadDot,
    };
  },

  listFromDTO(dtos = [], opts) {
    return (Array.isArray(dtos) ? dtos : [])
      .map((d) => this.fromDTO(d, opts))
      .filter(Boolean);
  },
};

export default MailViewModelFactory;
