// core/feed/states/unseen.state.js — State pattern.
// A feed group whose owner still has at least one unseen status.
// Higher priority bucket → rendered first (WhatsApp "Recent updates").
export class UnseenState {
  priority() {
    return 0; // 0 sorts before 1
  }

  get name() {
    return 'UNSEEN';
  }
}
