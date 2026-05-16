// Single source of truth for the API base URL.
export function getApiBaseUrl() {
  // Vite proxy handles /api → backend in dev. For prod/SSR override via env.
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  return envUrl || '/api';
}
