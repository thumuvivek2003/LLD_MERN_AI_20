// router/MemberRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SearchBooks from '../pages/member/SearchBooks';
import ViewBookStatus from '../pages/member/ViewBookStatus';
import ReserveBook from '../pages/member/ReserveBook';
import CancelReservation from '../pages/member/CancelReservation';
import BorrowHistory from '../pages/member/BorrowHistory';

export default function MemberRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/search" element={<SearchBooks />} />
        <Route path="/status" element={<ViewBookStatus />} />
        <Route path="/reserve" element={<ReserveBook />} />
        <Route path="/cancel-reservation" element={<CancelReservation />} />
        <Route path="/history" element={<BorrowHistory />} />
      </Route>
    </Routes>
  );
}