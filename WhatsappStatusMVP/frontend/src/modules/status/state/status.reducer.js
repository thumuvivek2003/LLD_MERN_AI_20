// modules/status/state/status.reducer.js — predictable state transitions
// (Reducer / State pattern) for the home feed.
import { STATUS_ACTIONS } from './status.actions.js';

export const initialStatusState = {
  feed: [],
  loading: true,
  error: null,
  dirty: false, // set by socket events → triggers a refetch
};

export function statusReducer(state, action) {
  switch (action.type) {
    case STATUS_ACTIONS.FEED_LOADING:
      return { ...state, loading: true, error: null };
    case STATUS_ACTIONS.FEED_LOADED:
      return { ...state, loading: false, error: null, dirty: false, feed: action.feed };
    case STATUS_ACTIONS.FEED_ERROR:
      return { ...state, loading: false, error: action.error };
    case STATUS_ACTIONS.DIRTY:
      return { ...state, dirty: true };
    default:
      return state;
  }
}
