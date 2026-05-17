// Lightweight stand-in: this project does not pull react-query; the provider
// exists to satisfy the architecture slot and let us swap caching later.
export function QueryProvider({ children }) {
  return children;
}

export default QueryProvider;
