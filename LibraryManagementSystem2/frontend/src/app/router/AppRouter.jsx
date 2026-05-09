import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes.js';
import { ROLES } from '../../shared/constants/roles.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleBasedRoute from './RoleBasedRoute.jsx';
import DashboardLayout from '../../shared/components/layouts/DashboardLayout.jsx';
import LoginPage from '../../modules/auth/pages/LoginPage.jsx';
import RegisterPage from '../../modules/auth/pages/RegisterPage.jsx';
import BookListPage from '../../modules/books/pages/BookListPage.jsx';
import BookDetailsPage from '../../modules/books/pages/BookDetailsPage.jsx';
import ManageBooksPage from '../../modules/books/pages/ManageBooksPage.jsx';
import BorrowRequestsPage from '../../modules/borrow/pages/BorrowRequestsPage.jsx';
import ApprovedBooksPage from '../../modules/borrow/pages/ApprovedBooksPage.jsx';
import ReturnedBooksPage from '../../modules/borrow/pages/ReturnedBooksPage.jsx';
import FinePage from '../../modules/borrow/pages/FinePage.jsx';
import UserListPage from '../../modules/users/pages/UserListPage.jsx';
import UserDetailsPage from '../../modules/users/pages/UserDetailsPage.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.BOOKS} element={<BookListPage />} />
            <Route path={ROUTES.BOOK_DETAILS} element={<BookDetailsPage />} />
            <Route path={ROUTES.APPROVED_BOOKS} element={<ApprovedBooksPage />} />
            <Route path={ROUTES.RETURNED_BOOKS} element={<ReturnedBooksPage />} />
            <Route path={ROUTES.FINES} element={<FinePage />} />
            <Route element={<RoleBasedRoute roles={[ROLES.ADMIN]} />}>
              <Route path={ROUTES.MANAGE_BOOKS} element={<ManageBooksPage />} />
              <Route path={ROUTES.BORROW_REQUESTS} element={<BorrowRequestsPage />} />
              <Route path={ROUTES.USERS} element={<UserListPage />} />
              <Route path={ROUTES.USER_DETAILS} element={<UserDetailsPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
