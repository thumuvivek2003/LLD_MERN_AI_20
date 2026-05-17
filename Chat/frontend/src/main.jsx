import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { AppProvider } from './providers/AppProvider.jsx';
import { QueryProvider } from './providers/QueryProvider.jsx';
import './shared/styles/theme.css';
import './shared/styles/global.css';

/**
 * Application bootstrap. Composes the provider tree and mounts <App />.
 */
export function bootstrapApplication() {
  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('Missing #root element in index.html');
  createRoot(rootEl).render(
    <StrictMode>
      <QueryProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </QueryProvider>
    </StrictMode>
  );
}

bootstrapApplication();
