import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/admin/AdminLayout.jsx';
import DashboardPage from '../modules/admin/dashboard/pages/DashboardPage.jsx';
import UsersPage from '../modules/admin/users/pages/UsersPage.jsx';
import UserDetailsPage from '../modules/admin/users/pages/UserDetailsPage.jsx';
import CouponsPage from '../modules/admin/coupons/pages/CouponsPage.jsx';
import CreateCouponPage from '../modules/admin/coupons/pages/CreateCouponPage.jsx';
import EditCouponPage from '../modules/admin/coupons/pages/EditCouponPage.jsx';
import CouponDetailsPage from '../modules/admin/coupons/pages/CouponDetailsPage.jsx';
import AdminOrdersPage from '../modules/admin/orders/pages/AdminOrdersPage.jsx';
import AdminOrderDetailsPage from '../modules/admin/orders/pages/AdminOrderDetailsPage.jsx';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="coupons/new" element={<CreateCouponPage />} />
        <Route path="coupons/:id" element={<CouponDetailsPage />} />
        <Route path="coupons/:id/edit" element={<EditCouponPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
