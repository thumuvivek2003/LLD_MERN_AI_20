import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../shared/layouts/DashboardLayout.jsx';
import { appRoutes } from './routes.js';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {appRoutes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
