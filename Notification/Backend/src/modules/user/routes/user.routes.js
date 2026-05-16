import { Router } from 'express';
import { userPreferenceController } from '../controllers/userPreference.controller.js';

export function registerUserRoutes() {
  const router = Router();
  router.get('/', userPreferenceController.listUsers);
  router.get('/:id', userPreferenceController.getUser);
  router.get('/:id/preferences', userPreferenceController.getPreferences);
  router.put('/:id/preferences', userPreferenceController.updatePreferences);
  return router;
}
