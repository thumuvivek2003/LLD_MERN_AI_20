import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserService } from '../services/UserService.js';

const UserContext = createContext(null);
const STORAGE_KEY = 'gmailmvp.currentUserId';

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await UserService.list();
      setUsers(list);
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const match = list.find((u) => u.id === savedId);
        if (match) setCurrentUser(match);
      }
      return list;
    } catch (e) {
      setError(e.message || 'Failed to load users');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const switchUser = useCallback((user) => {
    setCurrentUser(user);
    if (user?.id) localStorage.setItem(STORAGE_KEY, user.id);
  }, []);

  const clearUser = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      loading,
      error,
      loadUsers,
      switchUser,
      clearUser,
    }),
    [users, currentUser, loading, error, loadUsers, switchUser, clearUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

export default UserContext;
