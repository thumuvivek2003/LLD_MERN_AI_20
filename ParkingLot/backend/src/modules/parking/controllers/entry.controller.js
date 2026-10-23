import { ApiResponse } from '../../../shared/helpers/api-response.js';
import { entryService } from '../services/entry.service.js';
import { validateEntry } from '../validators/entry.validator.js';

export class EntryController {
  enter(req, res) {
    validateEntry(req.body);
    return ApiResponse.success(res, entryService.enter(req.body), 201);
  }
}

export const entryController = new EntryController();
