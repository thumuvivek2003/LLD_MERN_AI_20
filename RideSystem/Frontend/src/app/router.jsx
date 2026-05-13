import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../core/layouts/AuthLayout.jsx';
import RiderLayout from '../core/layouts/RiderLayout.jsx';
import DriverLayout from '../core/layouts/DriverLayout.jsx';
import AdminLayout from '../core/layouts/AdminLayout.jsx';
import { RiderRoute } from '../core/guards/RiderRoute.jsx';
import { DriverRoute } from '../core/guards/DriverRoute.jsx';
import { AdminRoute } from '../core/guards/AdminRoute.jsx';

import LoginPage from '../modules/auth/pages/LoginPage.jsx';
import RegisterPage from '../modules/auth/pages/RegisterPage.jsx';

import RiderHomePage from '../modules/rider/pages/RiderHomePage.jsx';
import FindDriverPage from '../modules/rider/pages/FindDriverPage.jsx';
import SearchingDriverPage from '../modules/rider/pages/SearchingDriverPage.jsx';
import DriverAcceptedPage from '../modules/rider/pages/DriverAcceptedPage.jsx';
import LiveTrackingPage from '../modules/rider/pages/LiveTrackingPage.jsx';
import OtpVerificationPage from '../modules/rider/pages/OtpVerificationPage.jsx';
import RideInProgressPage from '../modules/rider/pages/RideInProgressPage.jsx';
import RideCompletedPage from '../modules/rider/pages/RideCompletedPage.jsx';
import PaymentPage from '../modules/rider/pages/PaymentPage.jsx';
import RideHistoryPage from '../modules/rider/pages/RideHistoryPage.jsx';
import RideDetailsPage from '../modules/rider/pages/RideDetailsPage.jsx';

import DriverDashboardPage from '../modules/driver/pages/DriverDashboardPage.jsx';
import VehicleRegisterPage from '../modules/driver/pages/VehicleRegisterPage.jsx';
import OnlineStatusPage from '../modules/driver/pages/OnlineStatusPage.jsx';
import IncomingRidePage from '../modules/driver/pages/IncomingRidePage.jsx';
import RideAcceptedPage from '../modules/driver/pages/RideAcceptedPage.jsx';
import DriverOtpPage from '../modules/driver/pages/DriverOtpPage.jsx';
import DriverRidePage from '../modules/driver/pages/DriverRidePage.jsx';
import RideSummaryPage from '../modules/driver/pages/RideSummaryPage.jsx';
import EarningsPage from '../modules/driver/pages/EarningsPage.jsx';
import DriverRideHistoryPage from '../modules/driver/pages/DriverRideHistoryPage.jsx';
import DriverProfilePage from '../modules/driver/pages/DriverProfilePage.jsx';

import AdminDashboardPage from '../modules/admin/pages/AdminDashboardPage.jsx';
import RidersManagementPage from '../modules/admin/pages/RidersManagementPage.jsx';
import DriversManagementPage from '../modules/admin/pages/DriversManagementPage.jsx';
import DriverDetailsPage from '../modules/admin/pages/DriverDetailsPage.jsx';
import RideMonitoringPage from '../modules/admin/pages/RideMonitoringPage.jsx';
import AdminRideDetailsPage from '../modules/admin/pages/RideDetailsPage.jsx';
import BlockUserPage from '../modules/admin/pages/BlockUserPage.jsx';
import AnalyticsPage from '../modules/admin/pages/AnalyticsPage.jsx';
import AdminProfilePage from '../modules/admin/pages/AdminProfilePage.jsx';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RiderRoute><RiderLayout /></RiderRoute>}>
        <Route path="/rider" element={<RiderHomePage />} />
        <Route path="/rider/find" element={<FindDriverPage />} />
        <Route path="/rider/searching/:rideId" element={<SearchingDriverPage />} />
        <Route path="/rider/accepted/:rideId" element={<DriverAcceptedPage />} />
        <Route path="/rider/tracking/:rideId" element={<LiveTrackingPage />} />
        <Route path="/rider/otp/:rideId" element={<OtpVerificationPage />} />
        <Route path="/rider/in-progress/:rideId" element={<RideInProgressPage />} />
        <Route path="/rider/completed/:rideId" element={<RideCompletedPage />} />
        <Route path="/rider/pay/:rideId" element={<PaymentPage />} />
        <Route path="/rider/history" element={<RideHistoryPage />} />
        <Route path="/rider/ride/:rideId" element={<RideDetailsPage />} />
      </Route>

      <Route element={<DriverRoute><DriverLayout /></DriverRoute>}>
        <Route path="/driver" element={<DriverDashboardPage />} />
        <Route path="/driver/vehicle" element={<VehicleRegisterPage />} />
        <Route path="/driver/online" element={<OnlineStatusPage />} />
        <Route path="/driver/incoming" element={<IncomingRidePage />} />
        <Route path="/driver/accepted/:rideId" element={<RideAcceptedPage />} />
        <Route path="/driver/otp/:rideId" element={<DriverOtpPage />} />
        <Route path="/driver/ride/:rideId" element={<DriverRidePage />} />
        <Route path="/driver/summary/:rideId" element={<RideSummaryPage />} />
        <Route path="/driver/earnings" element={<EarningsPage />} />
        <Route path="/driver/history" element={<DriverRideHistoryPage />} />
        <Route path="/driver/profile" element={<DriverProfilePage />} />
      </Route>

      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/riders" element={<RidersManagementPage />} />
        <Route path="/admin/drivers" element={<DriversManagementPage />} />
        <Route path="/admin/drivers/:userId" element={<DriverDetailsPage />} />
        <Route path="/admin/rides" element={<RideMonitoringPage />} />
        <Route path="/admin/rides/:rideId" element={<AdminRideDetailsPage />} />
        <Route path="/admin/block/:userId" element={<BlockUserPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
