import { SearchStrategy } from './SearchStrategy.js';

/**
 * Field-scoped strategy for from / to / subject / body.
 */
export class FieldSearchStrategy extends SearchStrategy {
  constructor(type, label) {
    super();
    this._type = type;
    this._label = label;
  }
  get type() {
    return this._type;
  }
  get label() {
    return this._label;
  }
  haystack(vm) {
    switch (this._type) {
      case 'from':
        return [vm.sender?.name, vm.sender?.email].filter(Boolean).join(' ');
      case 'to':
        return vm.receiverNames || '';
      case 'subject':
        return vm.subject || '';
      case 'body':
        return vm.body || '';
      default:
        return super.haystack(vm);
    }
  }
}

export const FromSearchStrategy = () => new FieldSearchStrategy('from', 'From');
export const ToSearchStrategy = () => new FieldSearchStrategy('to', 'To');
export const SubjectSearchStrategy = () =>
  new FieldSearchStrategy('subject', 'Subject');
export const BodySearchStrategy = () => new FieldSearchStrategy('body', 'Body');
