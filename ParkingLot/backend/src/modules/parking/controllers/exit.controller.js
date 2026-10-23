import { ApiResponse } from '../../../shared/helpers/api-response.js';
import { exitService } from '../services/exit.service.js';
import { validateTicketCode } from '../validators/exit.validator.js';

export class ExitController {
  search(req, res) {
    const { code } = req.params;
    validateTicketCode(code);
    return ApiResponse.success(res, exitService.search(code));
  }

  quote(req, res) {
    const { code } = req.params;
    validateTicketCode(code);
    return ApiResponse.success(res, exitService.quote(code));
  }

  pay(req, res) {
    const { code } = req.params;
    validateTicketCode(code);
    return ApiResponse.success(res, exitService.pay(code));
  }

  close(req, res) {
    const { code } = req.params;
    validateTicketCode(code);
    return ApiResponse.success(res, exitService.close(code));
  }
}

export const exitController = new ExitController();
