import { ProtectedRoute } from './ProtectedRoute.jsx';
import { ROLES } from '../constants/roles.constants.js';
export const DriverRoute = ({ children }) => <ProtectedRoute allow={[ROLES.DRIVER]}>{children}</ProtectedRoute>;
