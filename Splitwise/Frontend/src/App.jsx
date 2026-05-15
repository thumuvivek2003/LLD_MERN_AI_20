import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage.jsx';
import DashboardPage from './modules/dashboard/pages/DashboardPage.jsx';
import CreateGroupPage from './modules/group/pages/CreateGroupPage.jsx';
import GroupDetailsPage from './modules/group/pages/GroupDetailsPage.jsx';
import AddExpensePage from './modules/expense/pages/AddExpensePage.jsx';
import EditExpensePage from './modules/expense/pages/EditExpensePage.jsx';
import SettleUpPage from './modules/settlement/pages/SettleUpPage.jsx';
import Toast from './shared/components/Toast.jsx';
import { useApp } from './shared/context/AppContext.jsx';

function RequireUser({ children }) {
  const { activeUser } = useApp();
  if (!activeUser) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireUser>
              <DashboardPage />
            </RequireUser>
          }
        />
        <Route
          path="/groups/new"
          element={
            <RequireUser>
              <CreateGroupPage />
            </RequireUser>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <RequireUser>
              <GroupDetailsPage />
            </RequireUser>
          }
        />
        <Route
          path="/groups/:groupId/expenses/new"
          element={
            <RequireUser>
              <AddExpensePage />
            </RequireUser>
          }
        />
        <Route
          path="/groups/:groupId/expenses/:expenseId/edit"
          element={
            <RequireUser>
              <EditExpensePage />
            </RequireUser>
          }
        />
        <Route
          path="/groups/:groupId/settle"
          element={
            <RequireUser>
              <SettleUpPage />
            </RequireUser>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
