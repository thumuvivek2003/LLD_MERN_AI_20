import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../modules/auth/pages/LoginPage.jsx';
import { OtpVerifyPage } from '../modules/auth/pages/OtpVerifyPage.jsx';
import { ProtectedRoutes } from './protected.routes.jsx';
import { RoleRoutes } from './role.routes.jsx';
import { UserLayout } from '../layouts/user-layout/UserLayout.jsx';
import { AdminLayout } from '../layouts/admin-layout/AdminLayout.jsx';
import { ChatHomePage } from '../modules/chat/pages/ChatHomePage.jsx';
import { ChatDetailPage } from '../modules/chat/pages/ChatDetailPage.jsx';
import { NewChatPage } from '../modules/chat/pages/NewChatPage.jsx';
import { CreateGroupPage } from '../modules/chat/pages/CreateGroupPage.jsx';
import { GroupInfoPage } from '../modules/chat/pages/GroupInfoPage.jsx';
import { MessageStatusPage } from '../modules/chat/pages/MessageStatusPage.jsx';
import { ContactsPage } from '../modules/user/pages/ContactsPage.jsx';
import { ProfilePage } from '../modules/user/pages/ProfilePage.jsx';
import { SettingsPage as UserSettingsPage } from '../modules/user/pages/SettingsPage.jsx';
import { DashboardPage } from '../modules/admin/pages/DashboardPage.jsx';
import { UsersPage } from '../modules/admin/pages/UsersPage.jsx';
import { UserDetailsPage } from '../modules/admin/pages/UserDetailsPage.jsx';
import { GroupsPage } from '../modules/admin/pages/GroupsPage.jsx';
import { SettingsPage as AdminSettingsPage } from '../modules/admin/pages/SettingsPage.jsx';
import { ROUTES } from '../shared/constants/routes.constant.js';
import { ROLES } from '../shared/constants/roles.constant.js';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.VERIFY} element={<OtpVerifyPage />} />

      {/* Authenticated */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<UserLayout />}>
          <Route path={ROUTES.CHATS} element={<ChatHomePage />} />
          <Route path="/chats/:chatId" element={<ChatDetailPage />} />
          <Route path={ROUTES.CONTACTS} element={<ContactsPage />} />
          <Route path={ROUTES.NEW_CHAT} element={<NewChatPage />} />
          <Route path={ROUTES.NEW_GROUP} element={<CreateGroupPage />} />
          <Route path="/group/:chatId/info" element={<GroupInfoPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SETTINGS} element={<UserSettingsPage />} />
          <Route
            path="/messages/:messageId/status"
            element={<MessageStatusPage />}
          />
        </Route>

        {/* Admin */}
        <Route element={<RoleRoutes role={ROLES.ADMIN} />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN} element={<DashboardPage />} />
            <Route path={ROUTES.ADMIN_USERS} element={<UsersPage />} />
            <Route path="/admin/users/:id" element={<UserDetailsPage />} />
            <Route path={ROUTES.ADMIN_GROUPS} element={<GroupsPage />} />
            <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Defaults */}
      <Route path="/" element={<Navigate to={ROUTES.CHATS} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.CHATS} replace />} />
    </Routes>
  );
}
