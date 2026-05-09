import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import BooksList from './pages/books/BooksList';
import AddEditBook from './pages/books/AddEditBook';
import BorrowHistory from './pages/borrow/BorrowHistory';
import ActiveBorrows from './pages/borrow/ActiveBorrows';
import Reservations from './pages/reservations/Reservations';
import Fines from './pages/fines/Fines';
import AllFines from './pages/fines/AllFines';
import UserProfile from './pages/profile/UserProfile';
import UsersList from './pages/users/UsersList';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/books" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/dashboard' : '/books'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/books" /> : <Register />} />

      <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/books" element={<ProtectedRoute><BooksList /></ProtectedRoute>} />
      <Route path="/books/add" element={<ProtectedRoute adminOnly><AddEditBook /></ProtectedRoute>} />
      <Route path="/books/edit/:id" element={<ProtectedRoute adminOnly><AddEditBook /></ProtectedRoute>} />
      <Route path="/borrows" element={<ProtectedRoute><BorrowHistory /></ProtectedRoute>} />
      <Route path="/admin/borrows" element={<ProtectedRoute adminOnly><ActiveBorrows /></ProtectedRoute>} />
      <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
      <Route path="/fines" element={<ProtectedRoute><Fines /></ProtectedRoute>} />
      <Route path="/admin/fines" element={<ProtectedRoute adminOnly><AllFines /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><UsersList /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/dashboard' : '/books') : '/login'} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
