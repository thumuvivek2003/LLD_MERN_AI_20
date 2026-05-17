import { useState, useCallback } from 'react';
import * as groupService from '../services/group.service.js';
import { useChatStore } from '../store/chat.store.js';

/**
 * Wraps the group-management mutations and reflects results into the chat
 * store so the UI stays consistent without a manual refresh.
 */
export function useGroup(chatId) {
  const upsertChat = useChatStore((s) => s.upsertChat);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wrap = useCallback(
    (fn) => async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const chat = await fn(...args);
        if (chat) upsertChat(chat);
        return chat;
      } catch (err) {
        setError(err.message || 'Operation failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [upsertChat]
  );

  const addMembers = wrap((memberIds) =>
    groupService.addMembers(chatId, memberIds)
  );
  const removeMember = wrap((userId) =>
    groupService.removeMember(chatId, userId)
  );
  const rename = wrap((name) => groupService.renameGroup(chatId, name));

  return { addMembers, removeMember, rename, loading, error };
}
