import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxies API + socket to the backend so the browser only talks to
// one origin (no CORS headaches, and the same-origin contract mirrors prod).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4002', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:4002', ws: true, changeOrigin: true },
    },
  },
});
