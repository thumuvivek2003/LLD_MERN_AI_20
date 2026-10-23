import { create } from 'zustand';
import { User } from '../utils/types';
import { AVATAR_COLORS } from '../utils/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1', email: 'admin@jira.dev', name: 'Admin', password: 'admin',
    role: 'admin', permissions: [], avatarColor: AVATAR_COLORS[0],
  },
  {
    id: '2', email: 'user@jira.dev', name: 'Alex Rivera', password: 'user',
    role: 'user', permissions: ['board:create','board:edit','column:create','column:edit','card:create','card:edit','card:move','card:delete','comment:create','label:create','member:add'],
    avatarColor: AVATAR_COLORS[1],
  },
];

let users = [...MOCK_USERS];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  register: (name, email, password) => {
    if (users.find((u) => u.email === email)) return false;
    const newUser = {
      id: crypto.randomUUID(),
      email, name, password,
      role: 'user' as const,
      permissions: ['board:create','board:edit','column:create','column:edit','card:create','card:edit','card:move','comment:create','label:create'],
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    users.push(newUser);
    const { password: _, ...user } = newUser;
    set({ user, isAuthenticated: true });
    return true;
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));

export const getAllUsers = () => users.map(({ password: _, ...u }) => u);
