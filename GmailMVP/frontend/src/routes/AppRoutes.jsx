import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from '../shared/context/UserContext.jsx';
import MailLayout from '../layouts/MailLayout.jsx';
import SwitchUserPage from '../modules/user/pages/SwitchUserPage.jsx';
import InboxPage from '../modules/mail/pages/InboxPage.jsx';
import SentPage from '../modules/mail/pages/SentPage.jsx';
import ComposePage from '../modules/mail/pages/ComposePage.jsx';
import MailDetailsPage from '../modules/mail/pages/MailDetailsPage.jsx';
import ThreadPage from '../modules/thread/pages/ThreadPage.jsx';
import SearchPage from '../modules/search/pages/SearchPage.jsx';

// Guards mail routes: without a selected user, bounce to Switch User.
function RequireUser({ children }) {
  const { currentUser, loading } = useUser();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
      </div>
    );
  }
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SwitchUserPage />} />
      <Route
        element={
          <RequireUser>
            <MailLayout />
          </RequireUser>
        }
      >
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/sent" element={<SentPage />} />
        <Route path="/compose" element={<ComposePage />} />
        <Route path="/mail/:id" element={<MailDetailsPage />} />
        <Route path="/thread/:id" element={<ThreadPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/inbox" replace />} />
    </Routes>
  );
}
