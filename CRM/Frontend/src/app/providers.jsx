import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../core/context/ToastContext.jsx';
import { UserProvider } from '../core/context/UserContext.jsx';
import { MetadataProvider } from '../core/context/MetadataContext.jsx';

/**
 * Provider composition, outermost first:
 *   Router → Toast (needed by everything) → User (identity) → Metadata (depends on user).
 */
export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <MetadataProvider>{children}</MetadataProvider>
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
