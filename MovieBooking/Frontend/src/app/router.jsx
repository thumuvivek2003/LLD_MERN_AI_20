import { createBrowserRouter } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ProtectedRoute from '../routes/protected.routes.jsx';

import LoginPage from '../features/auth/LoginPage.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';
import HomePage from '../features/movies/HomePage.jsx';
import MovieDetailsPage from '../features/movies/MovieDetailsPage.jsx';
import SeatSelectionPage from '../features/bookings/SeatSelectionPage.jsx';
import PaymentPage from '../features/bookings/PaymentPage.jsx';
import BookingSuccessPage from '../features/bookings/BookingSuccessPage.jsx';
import MyBookingsPage from '../features/bookings/MyBookingsPage.jsx';

import DashboardPage from '../features/admin/DashboardPage.jsx';
import MoviesPage from '../features/admin/MoviesPage.jsx';
import TheatersPage from '../features/admin/TheatersPage.jsx';
import ShowsPage from '../features/admin/ShowsPage.jsx';
import SeatLayoutDesignerPage from '../features/admin/SeatLayoutDesignerPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute role="user"><UserLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies/:movieId', element: <MovieDetailsPage /> },
      { path: 'shows/:showId/seats', element: <SeatSelectionPage /> },
      { path: 'payment', element: <PaymentPage /> },
      { path: 'booking-success', element: <BookingSuccessPage /> },
      { path: 'my-bookings', element: <MyBookingsPage /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'theaters', element: <TheatersPage /> },
      { path: 'shows', element: <ShowsPage /> },
      { path: 'screens/:screenId/layout', element: <SeatLayoutDesignerPage /> },
    ],
  },
]);
