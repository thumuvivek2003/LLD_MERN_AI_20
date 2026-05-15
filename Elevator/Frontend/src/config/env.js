export function loadEnvironmentConfig() {
  return {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
  };
}
