import { Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage.jsx';
import RegisterPage from '../modules/auth/pages/RegisterPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import CustomerRoutes from './CustomerRoutes.jsx';
import AdminRoutes from './AdminRoutes.jsx';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card max-w-md w-full text-center">
        <p className="text-5xl mb-3">🔍</p>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute role="customer">
            <CustomerRoutes />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
