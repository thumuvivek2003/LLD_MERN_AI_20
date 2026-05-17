import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../store/chat.store.js';
import { fetchChats } from '../services/chat.service.js';

/**
 * Loads the user's chat list on mount and keeps it in the zustand store.
 * Socket events also update the store directly via socket.listeners.
 */
export function useChats({ autoLoad = true } = {}) {
  const chats = useChatStore((s) => s.chats);
  const setChats = useChatStore((s) => s.setChats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChats();
      setChats(data || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load chats');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setChats]);

  useEffect(() => {
    if (autoLoad) refresh();
  }, [autoLoad, refresh]);

  return { chats, loading, error, refresh };
}
