import { mailApi } from '../api/mail.api.js';
import { MailViewModelFactory } from '../factory/MailViewModelFactory.js';

/**
 * Service layer: wraps the mail API and applies view-model transformation,
 * so pages/components deal only in UI-ready objects.
 */
export const MailService = {
  async inbox(userId) {
    const dtos = await mailApi.getInbox(userId);
    return MailViewModelFactory.listFromDTO(dtos, { context: 'inbox' });
  },

  async sent(userId) {
    const dtos = await mailApi.getSent(userId);
    return MailViewModelFactory.listFromDTO(dtos, { context: 'sent' });
  },

  async open(id, userId) {
    const dto = await mailApi.getMail(id, userId);
    return MailViewModelFactory.fromDTO(dto, { context: 'detail' });
  },

  async send({ senderId, to, subject, body }) {
    const dto = await mailApi.send({ senderId, to, subject, body });
    return MailViewModelFactory.fromDTO(dto, { context: 'sent' });
  },

  async reply(id, { senderId, body }) {
    const dto = await mailApi.reply(id, { senderId, body });
    return MailViewModelFactory.fromDTO(dto, { context: 'sent' });
  },

  countUnread(vms = []) {
    return vms.filter((v) => !v.isRead).length;
  },
};

export default MailService;
