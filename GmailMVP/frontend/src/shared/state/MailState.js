/**
 * State pattern base. A MailState knows how a mail card should be presented
 * (font weight, whether to show the unread dot, an accessible label).
 */
export class MailState {
  get isRead() {
    return false;
  }
  get showUnreadDot() {
    return false;
  }
  // Tailwind classes applied to the sender + subject text.
  get emphasisClass() {
    return 'font-normal text-slate-600';
  }
  get subjectClass() {
    return 'font-normal text-slate-700';
  }
  get label() {
    return 'mail';
  }
}
