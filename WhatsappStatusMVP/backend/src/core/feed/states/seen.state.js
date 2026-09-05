// core/feed/states/seen.state.js — State pattern.
// A feed group whose owner's statuses are ALL seen → "Viewed updates" bucket.
export class SeenState {
  priority() {
    return 1; // after unseen
  }

  get name() {
    return 'SEEN';
  }
}
