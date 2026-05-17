import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { UsersPage } from './pages/UsersPage.jsx';
import { UserDetailsPage } from './pages/UserDetailsPage.jsx';
import { GroupsPage } from './pages/GroupsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

export function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="users/:id" element={<UserDetailsPage />} />
      <Route path="groups" element={<GroupsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  );
}
