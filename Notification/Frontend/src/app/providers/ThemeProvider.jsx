import { createContext, useContext } from 'react';

const ThemeCtx = createContext({ mode: 'light' });

export function ThemeProvider({ children }) {
  // Single-mode theme today. ThemeCtx is reserved for future dark-mode toggle.
  return <ThemeCtx.Provider value={{ mode: 'light' }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
