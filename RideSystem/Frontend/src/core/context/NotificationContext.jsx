import { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '../services/notification.service.js';
import { useNotifications } from '../../modules/notification/hooks/useNotifications.js';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  useNotifications();

  useEffect(() => {
    return notificationService.subscribe((n) => {
      setItems((prev) => [n, ...prev].slice(0, 30));
      // auto-dismiss after 4s
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== n.id)), 4000);
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ items }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[320px]">
        {items.map((n) => (
          <div key={n.id} className="bg-white shadow-lg rounded-xl border border-slate-100 px-4 py-3 animate-in fade-in slide-in-from-right">
            <p className="text-sm font-semibold text-ink">{n.title}</p>
            {n.body && <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotificationCtx = () => useContext(NotificationContext);
