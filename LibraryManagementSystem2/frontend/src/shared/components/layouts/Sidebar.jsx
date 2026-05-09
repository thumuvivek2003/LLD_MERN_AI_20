import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';
import { useAuthStore } from '../../../app/store/authStore.js';

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  return (
    <nav className="sidebar">
      <h2>LMS</h2>
      <NavLink to={ROUTES.BOOKS}>Books</NavLink>
      <NavLink to={ROUTES.APPROVED_BOOKS}>My Borrows</NavLink>
      <NavLink to={ROUTES.FINES}>Fines</NavLink>
      {user?.role === ROLES.ADMIN && (
        <>
          <NavLink to={ROUTES.MANAGE_BOOKS}>Manage Books</NavLink>
          <NavLink to={ROUTES.BORROW_REQUESTS}>Borrow Requests</NavLink>
          <NavLink to={ROUTES.USERS}>Users</NavLink>
        </>
      )}
    </nav>
  );
}
