import { errorResponse } from '../utils/apiResponse.js';
import { UserRole } from '../enums/userRole.enum.js';

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return errorResponse(res, 'Forbidden', 403);
  }
  next();
};
