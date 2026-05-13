import { ProtectedRoute } from './ProtectedRoute.jsx';
import { ROLES } from '../constants/roles.constants.js';
export const RiderRoute = ({ children }) => <ProtectedRoute allow={[ROLES.RIDER]}>{children}</ProtectedRoute>;
