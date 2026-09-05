// app/router.jsx — createRouter(): route table + auth guard.
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/context/AuthProvider.jsx';
import { ROUTES } from '../core/constants/routes.constants.js';
import { UserLoginPage } from '../modules/auth/pages/UserLoginPage.jsx';
import { StatusFeedPage } from '../modules/status/pages/StatusFeedPage.jsx';
import { CreateStatusPage } from '../modules/status/pages/CreateStatusPage.jsx';
import { StatusViewerPage } from '../modules/status/pages/StatusViewerPage.jsx';
import { MyStatusesPage } from '../modules/status/pages/MyStatusesPage.jsx';
import { StatusViewersPage } from '../modules/status/pages/StatusViewersPage.jsx';

// Redirect to login when no user is selected.
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

export function AppRouter() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={user ? <Navigate to={ROUTES.FEED} replace /> : <UserLoginPage />} />
      <Route path={ROUTES.FEED} element={<Protected><StatusFeedPage /></Protected>} />
      <Route path={ROUTES.CREATE} element={<Protected><CreateStatusPage /></Protected>} />
      <Route path={ROUTES.MY_STATUS} element={<Protected><MyStatusesPage /></Protected>} />
      <Route path={ROUTES.MY_VIEWERS} element={<Protected><StatusViewersPage /></Protected>} />
      <Route path={ROUTES.VIEWER} element={<Protected><StatusViewerPage /></Protected>} />
      <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
    </Routes>
  );
}
