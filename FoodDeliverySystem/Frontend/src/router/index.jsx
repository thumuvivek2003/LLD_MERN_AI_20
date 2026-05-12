import { Routes, Route, Navigate } from 'react-router-dom';
import { USER_ROLES } from '../core/constants/roles.constants.js';
import { RoleBasedRoute } from './RoleBasedRoute.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import { LoginPage } from '../modules/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../modules/auth/pages/RegisterPage.jsx';
import { NotFoundPage } from '../shared/pages/NotFoundPage.jsx';
import { UnauthorizedPage } from '../shared/pages/UnauthorizedPage.jsx';

import { CustomerLayout } from '../layouts/CustomerLayout.jsx';
import { RestaurantAdminLayout } from '../layouts/RestaurantAdminLayout.jsx';
import { DeliveryPartnerLayout } from '../layouts/DeliveryPartnerLayout.jsx';
import { MainAdminLayout } from '../layouts/MainAdminLayout.jsx';

import { HomePage } from '../modules/customer/pages/HomePage.jsx';
import { RestaurantDetailsPage } from '../modules/customer/pages/RestaurantDetailsPage.jsx';
import { MenuItemDetailsPage } from '../modules/customer/pages/MenuItemDetailsPage.jsx';
import { CartPage } from '../modules/customer/pages/CartPage.jsx';
import { CheckoutPage } from '../modules/customer/pages/CheckoutPage.jsx';
import { OrderTrackingPage } from '../modules/customer/pages/OrderTrackingPage.jsx';
import { OrderHistoryPage } from '../modules/customer/pages/OrderHistoryPage.jsx';
import { OtpVerificationPage } from '../modules/customer/pages/OtpVerificationPage.jsx';

import { DashboardPage } from '../modules/restaurant-admin/pages/DashboardPage.jsx';
import { MenuManagementPage } from '../modules/restaurant-admin/pages/MenuManagementPage.jsx';
import { AddMenuItemPage } from '../modules/restaurant-admin/pages/AddMenuItemPage.jsx';
import { EditMenuItemPage } from '../modules/restaurant-admin/pages/EditMenuItemPage.jsx';
import { IncomingOrdersPage } from '../modules/restaurant-admin/pages/IncomingOrdersPage.jsx';
import { OrderDetailsPage } from '../modules/restaurant-admin/pages/OrderDetailsPage.jsx';
import { AssignDeliveryPage } from '../modules/restaurant-admin/pages/AssignDeliveryPage.jsx';
import { OrderStatusPage } from '../modules/restaurant-admin/pages/OrderStatusPage.jsx';
import { RestaurantProfilePage } from '../modules/restaurant-admin/pages/RestaurantProfilePage.jsx';

import { DeliveryDashboardPage } from '../modules/delivery-partner/pages/DeliveryDashboardPage.jsx';
import { AvailableOrdersPage } from '../modules/delivery-partner/pages/AvailableOrdersPage.jsx';
import { OngoingDeliveryPage } from '../modules/delivery-partner/pages/OngoingDeliveryPage.jsx';
import { PickupVerificationPage } from '../modules/delivery-partner/pages/PickupVerificationPage.jsx';
import { DeliveryOtpPage } from '../modules/delivery-partner/pages/DeliveryOtpPage.jsx';
import { DeliveryHistoryPage } from '../modules/delivery-partner/pages/DeliveryHistoryPage.jsx';
import { EarningsPage } from '../modules/delivery-partner/pages/EarningsPage.jsx';
import { DeliveryProfilePage } from '../modules/delivery-partner/pages/DeliveryProfilePage.jsx';

import { AdminDashboardPage } from '../modules/main-admin/pages/AdminDashboardPage.jsx';
import { UsersManagementPage } from '../modules/main-admin/pages/UsersManagementPage.jsx';
import { RestaurantsManagementPage } from '../modules/main-admin/pages/RestaurantsManagementPage.jsx';
import { AddRestaurantPage } from '../modules/main-admin/pages/AddRestaurantPage.jsx';
import { EditRestaurantPage } from '../modules/main-admin/pages/EditRestaurantPage.jsx';
import { RestaurantMappingPage } from '../modules/main-admin/pages/RestaurantMappingPage.jsx';
import { useAuthContext } from '../core/context/AuthContext.jsx';

const HomeRedirect = () => {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === USER_ROLES.SYSTEM_ADMIN) return <Navigate to="/admin" replace />;
  if (user.role === USER_ROLES.RESTAURANT_ADMIN) return <Navigate to="/restaurant" replace />;
  if (user.role === USER_ROLES.DELIVERY_PARTNER) return <Navigate to="/delivery" replace />;
  return <Navigate to="/customer" replace />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    <Route path="/customer" element={<RoleBasedRoute roles={[USER_ROLES.CUSTOMER]}><CustomerLayout /></RoleBasedRoute>}>
      <Route index element={<HomePage />} />
      <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />
      <Route path="menu-items/:id" element={<MenuItemDetailsPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="orders" element={<OrderHistoryPage />} />
      <Route path="orders/:id" element={<OrderTrackingPage />} />
      <Route path="otp/:id" element={<OtpVerificationPage />} />
    </Route>

    <Route path="/restaurant" element={<RoleBasedRoute roles={[USER_ROLES.RESTAURANT_ADMIN]}><RestaurantAdminLayout /></RoleBasedRoute>}>
      <Route index element={<DashboardPage />} />
      <Route path="menu" element={<MenuManagementPage />} />
      <Route path="menu/add" element={<AddMenuItemPage />} />
      <Route path="menu/:id/edit" element={<EditMenuItemPage />} />
      <Route path="orders" element={<IncomingOrdersPage />} />
      <Route path="orders/:id" element={<OrderDetailsPage />} />
      <Route path="orders/:id/assign" element={<AssignDeliveryPage />} />
      <Route path="orders/:id/status" element={<OrderStatusPage />} />
      <Route path="profile" element={<RestaurantProfilePage />} />
    </Route>

    <Route path="/delivery" element={<RoleBasedRoute roles={[USER_ROLES.DELIVERY_PARTNER]}><DeliveryPartnerLayout /></RoleBasedRoute>}>
      <Route index element={<DeliveryDashboardPage />} />
      <Route path="available" element={<AvailableOrdersPage />} />
      <Route path="ongoing" element={<OngoingDeliveryPage />} />
      <Route path="pickup/:id" element={<PickupVerificationPage />} />
      <Route path="otp/:id" element={<DeliveryOtpPage />} />
      <Route path="history" element={<DeliveryHistoryPage />} />
      <Route path="earnings" element={<EarningsPage />} />
      <Route path="profile" element={<DeliveryProfilePage />} />
    </Route>

    <Route path="/admin" element={<RoleBasedRoute roles={[USER_ROLES.SYSTEM_ADMIN]}><MainAdminLayout /></RoleBasedRoute>}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="users" element={<UsersManagementPage />} />
      <Route path="restaurants" element={<RestaurantsManagementPage />} />
      <Route path="restaurants/add" element={<AddRestaurantPage />} />
      <Route path="restaurants/:id/edit" element={<EditRestaurantPage />} />
      <Route path="restaurants/:id/mapping" element={<RestaurantMappingPage />} />
    </Route>

    <Route path="*" element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
  </Routes>
);
