import { ProtectedRoute } from './ProtectedRoute.jsx';
import { ROLES } from '../constants/roles.constants.js';
export const AdminRoute = ({ children }) => <ProtectedRoute allow={[ROLES.ADMIN]}>{children}</ProtectedRoute>;
