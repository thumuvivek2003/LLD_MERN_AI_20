// app/providers.jsx — registerProviders(): composes app-wide context providers.
// Order matters: Auth first (owns identity), then Status (depends on auth).
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../modules/auth/context/AuthProvider.jsx';
import { StatusProvider } from '../modules/status/state/StatusProvider.jsx';

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StatusProvider>{children}</StatusProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
