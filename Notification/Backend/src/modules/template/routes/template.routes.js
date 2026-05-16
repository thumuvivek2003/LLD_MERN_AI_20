import { Router } from 'express';
import { templateController } from '../controllers/template.controller.js';

export function registerTemplateRoutes() {
  const router = Router();
  router.get('/', templateController.getTemplates);
  router.get('/:id', templateController.getTemplate);
  router.get('/:id/versions', templateController.getVersions);
  router.post('/', templateController.createTemplate);
  router.post('/:id/versions', templateController.createTemplateVersion);
  return router;
}
