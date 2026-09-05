// modules/status/state/StatusProvider.jsx — Provider that owns feed state and
// subscribes to socket events (Observer). When a friend posts/deletes, or
// someone views, the feed is marked dirty and refetched — real-time updates.
import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { statusReducer, initialStatusState } from './status.reducer.js';
import { feedLoadingAction, feedLoadedAction, feedErrorAction } from './status.actions.js';
import { statusApi } from '../services/status.api.js';
import { useSocketEvent } from '../../../core/hooks/useSocketEvent.js';
import { SOCKET_EVENTS } from '../../../core/socket/socket.constants.js';
import { useAuth } from '../../auth/context/AuthProvider.jsx';

const StatusContext = createContext(null);

export function StatusProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(statusReducer, initialStatusState);

  // `silent` refetches without flashing the loader — used when returning to the
  // feed (e.g. after viewing a story) so seen/unseen updates appear instantly.
  const loadFeed = useCallback(async ({ silent = false } = {}) => {
    if (!silent) dispatch(feedLoadingAction());
    try {
      dispatch(feedLoadedAction(await statusApi.getFeed()));
    } catch (e) {
      dispatch(feedErrorAction(e.message));
    }
  }, []);

  useEffect(() => {
    if (user) loadFeed();
  }, [user, loadFeed]);

  // Live updates: a friend created/deleted a status → silently refetch.
  useSocketEvent(SOCKET_EVENTS.STATUS_CREATED, () => loadFeed({ silent: true }));
  useSocketEvent(SOCKET_EVENTS.STATUS_DELETED, () => loadFeed({ silent: true }));

  return (
    <StatusContext.Provider value={{ ...state, loadFeed, dispatch }}>{children}</StatusContext.Provider>
  );
}

export function useStatusContext() {
  const ctx = useContext(StatusContext);
  if (!ctx) throw new Error('useStatusContext must be used within StatusProvider');
  return ctx;
}
