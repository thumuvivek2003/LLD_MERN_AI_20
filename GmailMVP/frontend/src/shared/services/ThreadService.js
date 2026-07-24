import { threadApi } from '../api/thread.api.js';
import { MailViewModelFactory } from '../factory/MailViewModelFactory.js';
import { initials } from '../utils/formatter.js';

export const ThreadService = {
  async get(id) {
    const dto = await threadApi.getThread(id);
    if (!dto) return null;
    return {
      id: dto.id,
      subject: dto.subject || '(no subject)',
      participants: (dto.participants || []).map((p) => ({
        ...p,
        initials: initials(p.name),
        color: p.avatarColor || '#6366f1',
      })),
      mails: MailViewModelFactory.listFromDTO(dto.mails || [], {
        context: 'thread',
      }),
    };
  },
};

export default ThreadService;
