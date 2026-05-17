import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store.js';
import { roleHomeRoute } from '../modules/auth/hooks/useAuth.js';
import { ROUTES } from '../modules/shared/constants/routes.constant.js';
import { SocketProvider } from '../modules/shared/context/SocketProvider.jsx';
import { ROLES } from '../modules/shared/constants/roles.constant.js';

import RoleBasedRoute from './RoleBasedRoute.jsx';

import LoginPage from '../modules/auth/pages/LoginPage.jsx';
import RegisterPage from '../modules/auth/pages/RegisterPage.jsx';

import AdminLayout from '../layouts/AdminLayout.jsx';
import MemberLayout from '../layouts/MemberLayout.jsx';
import SpectatorLayout from '../layouts/SpectatorLayout.jsx';

import AdminDashboardPage from '../modules/admin/pages/AdminDashboardPage.jsx';
import CreateAuctionPage from '../modules/admin/pages/CreateAuctionPage.jsx';
import AuctionListPage from '../modules/admin/pages/AuctionListPage.jsx';
import AuctionDetailsPage from '../modules/admin/pages/AuctionDetailsPage.jsx';
import AssignBiddersPage from '../modules/admin/pages/AssignBiddersPage.jsx';
import AddAuctionItemPage from '../modules/admin/pages/AddAuctionItemPage.jsx';
import UsersManagementPage from '../modules/admin/pages/UsersManagementPage.jsx';
import AuctionSchedulePage from '../modules/admin/pages/AuctionSchedulePage.jsx';
import ReportsPage from '../modules/admin/pages/ReportsPage.jsx';

import MemberDashboardPage from '../modules/member/pages/MemberDashboardPage.jsx';
import LiveAuctionsPage from '../modules/member/pages/LiveAuctionsPage.jsx';
import AuctionLiveDetailsPage from '../modules/member/pages/AuctionLiveDetailsPage.jsx';
import PlaceBidPage from '../modules/member/pages/PlaceBidPage.jsx';
import WalletPage from '../modules/member/pages/WalletPage.jsx';
import MyBidsPage from '../modules/member/pages/MyBidsPage.jsx';
import MyWinsPage from '../modules/member/pages/MyWinsPage.jsx';
import ProfilePage from '../modules/member/pages/ProfilePage.jsx';

import SpectatorHomePage from '../modules/spectator/pages/SpectatorHomePage.jsx';
import SpectatorAuctionViewPage from '../modules/spectator/pages/SpectatorAuctionViewPage.jsx';

function RootRedirect() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to={ROUTES.SPECTATOR_HOME} replace />;
  return <Navigate to={roleHomeRoute(user.role)} replace />;
}

export default function AppRouter() {
  return (
    <SocketProvider>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        <Route
          path="/admin"
          element={
            <RoleBasedRoute role={ROLES.ADMIN}>
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="auctions" element={<AuctionListPage />} />
          <Route path="auctions/new" element={<CreateAuctionPage />} />
          <Route path="auctions/:id" element={<AuctionDetailsPage />} />
          <Route path="auctions/:id/assign" element={<AssignBiddersPage />} />
          <Route path="items/new" element={<AddAuctionItemPage />} />
          <Route path="users" element={<UsersManagementPage />} />
          <Route path="schedule" element={<AuctionSchedulePage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        <Route
          path="/member"
          element={
            <RoleBasedRoute role={ROLES.MEMBER}>
              <MemberLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<MemberDashboardPage />} />
          <Route path="auctions" element={<LiveAuctionsPage />} />
          <Route path="auctions/:id" element={<AuctionLiveDetailsPage />} />
          <Route path="auctions/:id/bid" element={<PlaceBidPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="bids" element={<MyBidsPage />} />
          <Route path="wins" element={<MyWinsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/spectator" element={<SpectatorLayout />}>
          <Route index element={<SpectatorHomePage />} />
          <Route path="auctions/:id" element={<SpectatorAuctionViewPage />} />
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </SocketProvider>
  );
}
