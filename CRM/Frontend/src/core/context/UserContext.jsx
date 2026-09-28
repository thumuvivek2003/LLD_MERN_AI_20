import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredUserId, setStoredUserId } from '../api/axios.client.js';
import usersApi from '../api/users.api.js';

const UserContext = createContext(null);

/**
 * There is no auth in MetaForce — identity is "which seeded user am I acting as".
 * This provider owns: the roster (`/users`), the picked id (localStorage), and the
 * resolved profile + permission matrix (`/me`) that `usePermission` reads.
 */
export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [userId, setUserId] = useState(getStoredUserId());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRoster = useCallback(async () => {
    try {
      const list = await usersApi.list();
      setUsers(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, []);

  const loadMe = useCallback(async (id) => {
    if (!id) {
      setMe(null);
      return;
    }
    try {
      setMe(await usersApi.me());
      setError(null);
    } catch (err) {
      setMe(null);
      setError(err);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      await loadRoster();
      await loadMe(getStoredUserId());
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [loadRoster, loadMe]);

  const signInAs = useCallback(
    async (id) => {
      setStoredUserId(id);
      setUserId(id);
      setLoading(true);
      await loadMe(id);
      setLoading(false);
    },
    [loadMe],
  );

  const signOut = useCallback(() => {
    setStoredUserId('');
    setUserId('');
    setMe(null);
  }, []);

  const value = useMemo(
    () => ({
      users,
      me,
      userId,
      role: me?.role || null,
      loading,
      error,
      signInAs,
      signOut,
      refreshMe: () => loadMe(userId),
      refreshUsers: loadRoster,
    }),
    [users, me, userId, loading, error, signInAs, signOut, loadMe, loadRoster],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside <UserProvider>');
  return context;
};

export default UserContext;
