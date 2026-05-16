// Lightweight cache/refetch context. MVP uses Zustand for state, but this
// provider exists per the tree so it can be swapped for React Query later.
import { createContext, useContext, useMemo, useRef } from 'react';

const QueryCtx = createContext(null);

export function QueryProvider({ children }) {
  const cacheRef = useRef(new Map());
  const value = useMemo(
    () => ({
      get: (key) => cacheRef.current.get(key),
      set: (key, val) => cacheRef.current.set(key, val),
      invalidate: (key) => cacheRef.current.delete(key),
      clear: () => cacheRef.current.clear(),
    }),
    [],
  );
  return <QueryCtx.Provider value={value}>{children}</QueryCtx.Provider>;
}

export function useQueryCache() {
  return useContext(QueryCtx);
}
