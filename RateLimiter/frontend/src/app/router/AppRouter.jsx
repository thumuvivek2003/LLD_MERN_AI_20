import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/store/auth.store.js';
import { ROUTES } from '../../modules/shared/constants/routes.js';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ClientLayout } from '../layouts/ClientLayout.jsx';
import { LoginPage } from '../../modules/auth/pages/LoginPage.jsx';
import { AdminDashboardPage } from '../../modules/dashboard/pages/AdminDashboardPage.jsx';
import { ClientDashboardPage } from '../../modules/dashboard/pages/ClientDashboardPage.jsx';
import { StrategyManagementPage } from '../../modules/strategies/pages/StrategyManagementPage.jsx';
import { ConfigurationPage } from '../../modules/configurations/pages/ConfigurationPage.jsx';
import { UserManagementPage } from '../../modules/users/pages/UserManagementPage.jsx';
import { ClientDetailsPage } from '../../modules/users/pages/ClientDetailsPage.jsx';
import { ApiConsolePage } from '../../modules/apiConsole/pages/ApiConsolePage.jsx';
import { UsageHistoryPage } from '../../modules/dashboard/pages/UsageHistoryPage.jsx';

function RequireRole({ role, children }) {
  const { token, user } = useAuthStore();
  if (!token || !user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user.role !== role) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
}

function RootRedirect() {
  const { token, user } = useAuthStore();
  if (!token || !user) return <Navigate to={ROUTES.LOGIN} replace />;
  return (
    <Navigate to={user.role === 'admin' ? ROUTES.ADMIN : ROUTES.CLIENT} replace />
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route
        element={
          <RequireRole role="admin">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
        <Route
          path={ROUTES.ADMIN_STRATEGIES}
          element={<StrategyManagementPage />}
        />
        <Route path={ROUTES.ADMIN_CONFIG} element={<ConfigurationPage />} />
        <Route path={ROUTES.ADMIN_CLIENTS} element={<UserManagementPage />} />
        <Route
          path={ROUTES.ADMIN_CLIENT_DETAILS}
          element={<ClientDetailsPage />}
        />
      </Route>

      <Route
        element={
          <RequireRole role="client">
            <ClientLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.CLIENT} element={<ClientDashboardPage />} />
        <Route path={ROUTES.CLIENT_CONSOLE} element={<ApiConsolePage />} />
        <Route path={ROUTES.CLIENT_HISTORY} element={<UsageHistoryPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}

export default AppRouter;
