// P2LibraryManagement.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/common/Home';
import NotFound from './pages/common/NotFound';
import MemberRoutes from './router/MemberRoutes';
import LibrarianRoutes from './router/LibrarianRoutes';
import AdminRoutes from './router/AdminRoutes';

function P2LibraryManagement() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="member/*" element={<MemberRoutes />} />
              <Route path="librarian/*" element={<LibrarianRoutes />} />
            </Route>
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="*" element={<AdminRoutes />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
}

export default P2LibraryManagement;