import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './shared/styles/theme.css';
import './shared/styles/global.css';

export function bootstrapReactApp() {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    throw new Error('Missing #root element');
  }
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrapReactApp();
