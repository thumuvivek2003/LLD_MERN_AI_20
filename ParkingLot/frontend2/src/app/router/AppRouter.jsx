import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { Routes } from '../../constants/routes.js';
import { Roles } from '../../constants/roles.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleBasedRoute } from './RoleBasedRoute.jsx';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';

import { LoginPage } from '../../pages/auth/LoginPage.jsx';

import { DashboardPage } from '../../pages/admin/DashboardPage.jsx';
import { ParkingLotsPage } from '../../pages/admin/ParkingLotsPage.jsx';
import { FloorsPage } from '../../pages/admin/FloorsPage.jsx';
import { SlotsPage } from '../../pages/admin/SlotsPage.jsx';
import { UsersPage } from '../../pages/admin/UsersPage.jsx';
import { PricingStrategiesPage } from '../../pages/admin/PricingStrategiesPage.jsx';
import { PaymentsPage } from '../../pages/admin/PaymentsPage.jsx';

import { NewEntryPage } from '../../pages/entry/NewEntryPage.jsx';
import { AllocateSlotPage } from '../../pages/entry/AllocateSlotPage.jsx';
import { TicketGeneratedPage } from '../../pages/entry/TicketGeneratedPage.jsx';

import { SearchTicketPage } from '../../pages/exit/SearchTicketPage.jsx';
import { TicketFarePage } from '../../pages/exit/TicketFarePage.jsx';
import { PaymentSuccessPage } from '../../pages/exit/PaymentSuccessPage.jsx';

const adminOnly = (element) => (
  <RoleBasedRoute allow={[Roles.ADMIN]}>{element}</RoleBasedRoute>
);

export function AppRouter() {
  return (
    <RouterRoutes>
      <Route path={Routes.LOGIN} element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={Routes.ADMIN_DASHBOARD} element={adminOnly(<DashboardPage />)} />
        <Route path={Routes.ADMIN_LOTS} element={adminOnly(<ParkingLotsPage />)} />
        <Route path={Routes.ADMIN_FLOORS} element={adminOnly(<FloorsPage />)} />
        <Route path={Routes.ADMIN_SLOTS} element={adminOnly(<SlotsPage />)} />
        <Route path={Routes.ADMIN_USERS} element={adminOnly(<UsersPage />)} />
        <Route path={Routes.ADMIN_PRICING} element={adminOnly(<PricingStrategiesPage />)} />
        <Route path={Routes.ADMIN_PAYMENTS} element={adminOnly(<PaymentsPage />)} />

        <Route path={Routes.ENTRY_NEW} element={<NewEntryPage />} />
        <Route path={Routes.ENTRY_ALLOCATE} element={<AllocateSlotPage />} />
        <Route path={Routes.ENTRY_TICKET} element={<TicketGeneratedPage />} />

        <Route path={Routes.EXIT_SEARCH} element={<SearchTicketPage />} />
        <Route path={Routes.EXIT_FARE} element={<TicketFarePage />} />
        <Route path={Routes.EXIT_SUCCESS} element={<PaymentSuccessPage />} />
      </Route>

      <Route path="/" element={<Navigate to={Routes.LOGIN} replace />} />
      <Route path="*" element={<Navigate to={Routes.LOGIN} replace />} />
    </RouterRoutes>
  );
}
