import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from '../modules/socket/socket.provider.jsx';

/**
 * Wraps the app in cross-cutting providers. Router must be outermost so
 * SocketProvider can call useNavigate-driven hooks if needed in future.
 */
export function AppProvider({ children }) {
  return (
    <BrowserRouter>
      <SocketProvider>{children}</SocketProvider>
    </BrowserRouter>
  );
}
