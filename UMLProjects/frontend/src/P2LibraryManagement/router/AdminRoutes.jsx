// router/AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import AddBook from '../pages/admin/AddBook';
import UpdateBook from '../pages/admin/UpdateBook';
import DeleteBook from '../pages/admin/DeleteBook';
import ManageUsers from '../pages/admin/ManageUsers';
import Reports from '../pages/admin/Reports';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/update-book" element={<UpdateBook />} />
        <Route path="/delete-book" element={<DeleteBook />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}