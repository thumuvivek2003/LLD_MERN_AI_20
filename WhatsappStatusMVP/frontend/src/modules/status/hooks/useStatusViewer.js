// modules/status/hooks/useStatusViewer.js — drives the story viewer for one
// friend: loads statuses, resumes at first unseen, auto-advances, records views.
import { useCallback, useEffect, useRef, useState } from 'react';
import { statusApi } from '../services/status.api.js';

const STORY_MS = 5000;

export function useStatusViewer(userId, { onExit } = {}) {
  const [data, setData] = useState(null); // { user, statuses, resumeIndex }
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewedRef = useRef(new Set());

  // Keep the exit callback in a ref so it never destabilises timers/callbacks
  // (the page recreates it every render — that used to freeze the progress bar).
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setProgress(0); // fresh person → restart the progress bar
    setPaused(false);
    statusApi
      .getUserStatuses(userId)
      .then((res) => {
        if (!alive) return;
        setData(res);
        setIndex(res.resumeIndex || 0);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [userId]);

  const count = data?.statuses?.length || 0;
  const current = data?.statuses?.[index];

  // Record a view once per status (idempotent on the server anyway).
  useEffect(() => {
    if (!current || viewedRef.current.has(current.id)) return;
    viewedRef.current.add(current.id);
    statusApi.markViewed(current.id).catch(() => {});
  }, [current]);

  // Advance one story; exit after the last. Depends only on `count`, so it is
  // stable across the 50ms progress re-renders.
  const advance = useCallback(() => {
    setProgress(0);
    setIndex((i) => {
      if (i + 1 < count) return i + 1;
      onExitRef.current?.();
      return i;
    });
  }, [count]);

  const prev = useCallback(() => {
    setProgress(0);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  // Progress timer. Keyed on the current story id + paused only, so it is NOT
  // recreated on every tick. Resumes from wherever progress currently is.
  useEffect(() => {
    if (!current || paused) return;
    const start = Date.now() - (progress / 100) * STORY_MS;
    const id = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / STORY_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        advance();
      }
    }, 50);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, paused, count]);

  return {
    user: data?.user,
    statuses: data?.statuses || [],
    index, current, progress, loading, error,
    next: advance, prev,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
}
