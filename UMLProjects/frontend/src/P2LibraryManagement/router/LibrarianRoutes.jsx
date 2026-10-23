// router/LibrarianRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import IssueBook from '../pages/librarian/IssueBook';
import ReturnBook from '../pages/librarian/ReturnBook';
import TrackBorrowHistory from '../pages/librarian/TrackBorrowHistory';
import UpdateBookInfo from '../pages/librarian/UpdateBookInfo';

export default function LibrarianRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/issue" element={<IssueBook />} />
        <Route path="/return" element={<ReturnBook />} />
        <Route path="/history" element={<TrackBorrowHistory />} />
        <Route path="/update-book" element={<UpdateBookInfo />} />
      </Route>
    </Routes>
  );
}