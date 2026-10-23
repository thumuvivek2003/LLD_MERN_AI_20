import { Routes, Route, Navigate } from 'react-router-dom';
import { Routes as R } from '../../constants/routes.js';
import { Role } from '../../constants/roles.js';
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

export const AppRouter = () => (
  <Routes>
    <Route path={R.LOGIN} element={<LoginPage />} />

    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route
        path={R.ADMIN.DASHBOARD}
        element={<RoleBasedRoute allow={[Role.ADMIN]}><DashboardPage /></RoleBasedRoute>}
      />
      <Route path={R.ADMIN.LOTS} element={<RoleBasedRoute allow={[Role.ADMIN]}><ParkingLotsPage /></RoleBasedRoute>} />
      <Route path={R.ADMIN.FLOORS} element={<RoleBasedRoute allow={[Role.ADMIN]}><FloorsPage /></RoleBasedRoute>} />
      <Route path={R.ADMIN.SLOTS} element={<RoleBasedRoute allow={[Role.ADMIN]}><SlotsPage /></RoleBasedRoute>} />
      <Route path={R.ADMIN.USERS} element={<RoleBasedRoute allow={[Role.ADMIN]}><UsersPage /></RoleBasedRoute>} />
      <Route path={R.ADMIN.PRICING} element={<RoleBasedRoute allow={[Role.ADMIN]}><PricingStrategiesPage /></RoleBasedRoute>} />
      <Route path={R.ADMIN.PAYMENTS} element={<RoleBasedRoute allow={[Role.ADMIN]}><PaymentsPage /></RoleBasedRoute>} />

      <Route
        path={R.ENTRY.NEW}
        element={<RoleBasedRoute allow={[Role.ADMIN, Role.ATTENDANT]}><NewEntryPage /></RoleBasedRoute>}
      />
      <Route path={R.ENTRY.ALLOCATE} element={<RoleBasedRoute allow={[Role.ADMIN, Role.ATTENDANT]}><AllocateSlotPage /></RoleBasedRoute>} />
      <Route path={R.ENTRY.TICKET} element={<RoleBasedRoute allow={[Role.ADMIN, Role.ATTENDANT]}><TicketGeneratedPage /></RoleBasedRoute>} />

      <Route path={R.EXIT.SEARCH} element={<RoleBasedRoute allow={[Role.ADMIN, Role.ATTENDANT]}><SearchTicketPage /></RoleBasedRoute>} />
      <Route path={R.EXIT.FARE} element={<RoleBasedRoute allow={[Role.ADMIN, Role.ATTENDANT]}><TicketFarePage /></RoleBasedRoute>} />
      <Route path={R.EXIT.SUCCESS} element={<RoleBasedRoute allow={[Role.ADMIN, Role.ATTENDANT]}><PaymentSuccessPage /></RoleBasedRoute>} />
    </Route>

    <Route path="*" element={<Navigate to={R.LOGIN} replace />} />
  </Routes>
);
