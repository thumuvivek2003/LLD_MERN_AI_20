import { Route } from 'react-router-dom';
import { AdminDashboardPage } from '../modules/admin/pages/AdminDashboardPage.jsx';
import { NotificationManagementPage } from '../modules/admin/pages/NotificationManagementPage.jsx';
import { NotificationDetailsPage } from '../modules/admin/pages/NotificationDetailsPage.jsx';
import { RetryFailedPage } from '../modules/admin/pages/RetryFailedPage.jsx';
import { SystemAnalyticsPage } from '../modules/admin/pages/SystemAnalyticsPage.jsx';

export function AdminRoutes() {
  return [
    <Route key="admin-dash" path="/admin" element={<AdminDashboardPage />} />,
    <Route
      key="admin-notifs"
      path="/admin/notifications"
      element={<NotificationManagementPage />}
    />,
    <Route
      key="admin-notif-details"
      path="/admin/notifications/:id"
      element={<NotificationDetailsPage />}
    />,
    <Route key="admin-retry" path="/admin/retry" element={<RetryFailedPage />} />,
    <Route
      key="admin-analytics"
      path="/admin/analytics"
      element={<SystemAnalyticsPage />}
    />,
  ];
}
