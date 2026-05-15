import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'splitwise_user';
const STORAGE_KEY_ID = 'splitwise_user_id';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });

  const [toast, setToast] = useState(null); // { type: 'success' | 'error' | 'info', message }

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUser));
      localStorage.setItem(STORAGE_KEY_ID, activeUser.userId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_ID);
    }
  }, [activeUser]);

  const login = useCallback((user) => setActiveUser(user), []);
  const logout = useCallback(() => setActiveUser(null), []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({
      activeUser,
      login,
      logout,
      toast,
      showToast,
      dismissToast,
      success: (m) => showToast(m, 'success'),
      error: (m) => showToast(m, 'error'),
      info: (m) => showToast(m, 'info')
    }),
    [activeUser, login, logout, toast, showToast, dismissToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
