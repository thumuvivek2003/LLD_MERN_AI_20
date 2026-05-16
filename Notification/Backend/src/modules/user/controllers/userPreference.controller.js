import { userPreferenceService } from '../services/userPreference.service.js';
import { ok } from '../../../shared/utils/response.util.js';

export const userPreferenceController = {
  async listUsers(_req, res, next) {
    try {
      const users = await userPreferenceService.listUsers();
      return ok(res, users);
    } catch (err) {
      next(err);
    }
  },

  async getUser(req, res, next) {
    try {
      const user = await userPreferenceService.getUser(req.params.id);
      return ok(res, user);
    } catch (err) {
      next(err);
    }
  },

  async getPreferences(req, res, next) {
    try {
      const prefs = await userPreferenceService.getPreferences(req.params.id);
      return ok(res, prefs);
    } catch (err) {
      next(err);
    }
  },

  async updatePreferences(req, res, next) {
    try {
      const prefs = await userPreferenceService.updatePreferences(req.params.id, req.body || {});
      return ok(res, prefs);
    } catch (err) {
      next(err);
    }
  },
};
