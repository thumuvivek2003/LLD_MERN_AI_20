import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './core/styles/globals.css';

export const bootstrapApplication = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

bootstrapApplication();
