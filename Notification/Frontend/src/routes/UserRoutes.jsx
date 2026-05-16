import { Route } from 'react-router-dom';
import { UserDashboardPage } from '../modules/user/pages/UserDashboardPage.jsx';
import { UserNotificationsPage } from '../modules/user/pages/UserNotificationsPage.jsx';
import { NotificationPreferencesPage } from '../modules/user/pages/NotificationPreferencesPage.jsx';

// Returns the user-scoped <Route> nodes so AppRoutes can compose them.
export function UserRoutes() {
  return [
    <Route key="user-dash" path="/user" element={<UserDashboardPage />} />,
    <Route
      key="user-notifs"
      path="/user/notifications"
      element={<UserNotificationsPage />}
    />,
    <Route
      key="user-prefs"
      path="/user/preferences"
      element={<NotificationPreferencesPage />}
    />,
  ];
}
