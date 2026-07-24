import { MailState } from './MailState.js';

export class ReadState extends MailState {
  get isRead() {
    return true;
  }
  get showUnreadDot() {
    return false;
  }
  get emphasisClass() {
    return 'font-normal text-slate-500';
  }
  get subjectClass() {
    return 'font-normal text-slate-600';
  }
  get label() {
    return 'read';
  }
}
