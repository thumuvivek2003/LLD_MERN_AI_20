// modules/status/state/status.actions.js — action creators for the reducer.
export const STATUS_ACTIONS = Object.freeze({
  FEED_LOADING: 'FEED_LOADING',
  FEED_LOADED: 'FEED_LOADED',
  FEED_ERROR: 'FEED_ERROR',
  DIRTY: 'DIRTY', // a socket event says the feed may be stale
});

export const feedLoadingAction = () => ({ type: STATUS_ACTIONS.FEED_LOADING });
export const feedLoadedAction = (feed) => ({ type: STATUS_ACTIONS.FEED_LOADED, feed });
export const feedErrorAction = (error) => ({ type: STATUS_ACTIONS.FEED_ERROR, error });
export const markDirtyAction = () => ({ type: STATUS_ACTIONS.DIRTY });
