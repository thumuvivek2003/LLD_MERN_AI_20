import { MailState } from './MailState.js';

export class UnreadState extends MailState {
  get isRead() {
    return false;
  }
  get showUnreadDot() {
    return true;
  }
  get emphasisClass() {
    return 'font-bold text-slate-900';
  }
  get subjectClass() {
    return 'font-semibold text-slate-900';
  }
  get label() {
    return 'unread';
  }
}
