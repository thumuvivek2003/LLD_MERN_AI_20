import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTypingStore } from '../store/typing.store.js';

/**
 * Encapsulates typing emit lifecycle: start on first keystroke, stop after
 * idle (default 1500ms) or unmount, returns local typing-users list too.
 */
export function useTyping({
  chatId,
  emitStart,
  emitStop,
  idleMs = 1500,
} = {}) {
  const idleTimer = useRef(null);
  const isTypingRef = useRef(false);

  // Select the Map ref directly so zustand's identity check works; derive
  // the array via useMemo to avoid creating new refs on every render.
  const typingMap = useTypingStore((s) =>
    chatId ? s.byChat[chatId] : undefined
  );
  const typingUsers = useMemo(() => {
    if (!typingMap) return [];
    return Array.from(typingMap.entries()).map(([userId, userName]) => ({
      userId,
      userName,
    }));
  }, [typingMap]);

  const stop = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      emitStop?.({ chatId });
    }
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, [chatId, emitStop]);

  const onKeystroke = useCallback(() => {
    if (!chatId) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitStart?.({ chatId });
    }
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => stop(), idleMs);
  }, [chatId, emitStart, idleMs, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { onKeystroke, stop, typingUsers };
}
