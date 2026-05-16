import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { UserRoutes } from './UserRoutes.jsx';
import { AdminRoutes } from './AdminRoutes.jsx';
import { SystemRoutes } from './SystemRoutes.jsx';
import { useCurrentActorStore } from '../shared/state/currentActor.store.js';
import { getAppRoutes } from '../config/route.config.js';

export function AppRoutes() {
  const role = useCurrentActorStore((s) => s.role);
  const home = getAppRoutes()[role] || '/user';

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Default redirect based on current actor */}
        <Route path="/" element={<Navigate to={home} replace />} />

        {UserRoutes()}
        {AdminRoutes()}
        {SystemRoutes()}

        <Route path="*" element={<Navigate to={home} replace />} />
      </Route>
    </Routes>
  );
}
