import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../../../core/context/UserContext.jsx';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';

/**
 * Favorites and "recently opened" are personal UI preferences — the contract
 * exposes no endpoint for them, so they live in localStorage per user.
 * This is real user state, never stand-in data for a missing API.
 */
const key = (userId, bucket) => `metaforce.${bucket}.${userId || 'anon'}`;

const read = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (storageKey, value) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — preferences are best-effort */
  }
};

export function useWorkspace() {
  const { userId } = useUser();
  const { objects } = useMetadata();
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setFavorites(read(key(userId, 'favorites')));
    setRecent(read(key(userId, 'recent')));
  }, [userId]);

  const toggleFavorite = useCallback(
    (objectId) => {
      setFavorites((current) => {
        const next = current.includes(objectId)
          ? current.filter((item) => item !== objectId)
          : [...current, objectId];
        write(key(userId, 'favorites'), next);
        return next;
      });
    },
    [userId],
  );

  const touch = useCallback(
    (objectId) => {
      if (!objectId) return;
      setRecent((current) => {
        const next = [
          { objectId, at: new Date().toISOString() },
          ...current.filter((item) => item.objectId !== objectId),
        ].slice(0, 8);
        write(key(userId, 'recent'), next);
        return next;
      });
    },
    [userId],
  );

  const hydrate = useCallback(
    (ids) => ids.map((id) => objects.find((object) => object.objectId === id)).filter(Boolean),
    [objects],
  );

  return {
    favorites,
    favoriteObjects: hydrate(favorites),
    recent,
    recentObjects: hydrate(recent.map((item) => item.objectId)),
    isFavorite: (objectId) => favorites.includes(objectId),
    toggleFavorite,
    touch,
  };
}

export default useWorkspace;
