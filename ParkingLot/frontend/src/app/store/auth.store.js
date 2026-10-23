import { create } from 'zustand';

const readUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw || raw === 'undefined') return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: readUser(),
  setSession: ({ token, user }) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    if (user !== undefined && user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ token: token ?? null, user: user ?? null });
  },
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));
