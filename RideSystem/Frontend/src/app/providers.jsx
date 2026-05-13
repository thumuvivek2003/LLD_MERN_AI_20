import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../core/context/AuthContext.jsx';
import { SocketProvider } from '../core/context/SocketContext.jsx';
import { NotificationProvider } from '../core/context/NotificationContext.jsx';

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
