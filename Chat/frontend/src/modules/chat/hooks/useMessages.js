import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from '../store/message.store.js';
import { fetchMessages } from '../services/message.service.js';

/**
 * Loads message history for a chat into the message store and exposes
 * a `loadMore` cursor for older pages.
 */
const EMPTY = [];

export function useMessages(chatId) {
  const messages = useMessageStore((s) =>
    chatId ? s.byChat[chatId] || EMPTY : EMPTY
  );
  const setMessages = useMessageStore((s) => s.setMessages);
  const prependMessages = useMessageStore((s) => s.prependMessages);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMessages(chatId, { limit: 50 });
      setMessages(chatId, data || []);
      setHasMore((data || []).length >= 50);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [chatId, setMessages]);

  const loadMore = useCallback(async () => {
    if (!chatId || !hasMore) return;
    const first = (useMessageStore.getState().byChat[chatId] || [])[0];
    if (!first) return;
    setLoadingMore(true);
    try {
      const older = await fetchMessages(chatId, {
        limit: 50,
        before: first.id,
      });
      if (!older || older.length === 0) {
        setHasMore(false);
      } else {
        prependMessages(chatId, older);
        if (older.length < 50) setHasMore(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load older messages');
    } finally {
      setLoadingMore(false);
    }
  }, [chatId, hasMore, prependMessages]);

  useEffect(() => {
    if (chatId) load();
  }, [chatId, load]);

  return { messages, loading, loadingMore, hasMore, error, loadMore, refresh: load };
}
