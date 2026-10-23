import { ApiResponse } from '../../../shared/helpers/api-response.js';
import { authService } from '../services/auth.service.js';
import { validateLogin, validateCreateUser } from '../validators/auth.validator.js';

export class AuthController {
  login(req, res) {
    validateLogin(req.body);
    const result = authService.login(req.body.username, req.body.password);
    return ApiResponse.success(res, result);
  }

  createUser(req, res) {
    validateCreateUser(req.body);
    const user = authService.createUser(req.body);
    const { password, ...safe } = user;
    return ApiResponse.success(res, safe, 201);
  }

  assignToLot(req, res) {
    const { userId } = req.params;
    const { parkingLotId } = req.body;
    const user = authService.assignToLot(userId, parkingLotId);
    const { password, ...safe } = user;
    return ApiResponse.success(res, safe);
  }

  list(_req, res) {
    return ApiResponse.success(res, authService.list());
  }
}

export const authController = new AuthController();
