import { templateService } from '../services/template.service.js';
import { ok } from '../../../shared/utils/response.util.js';

export const templateController = {
  async createTemplate(req, res, next) {
    try {
      const tmpl = await templateService.createTemplate(req.body);
      return ok(res, tmpl, 201);
    } catch (err) {
      next(err);
    }
  },

  async createTemplateVersion(req, res, next) {
    try {
      const tmpl = await templateService.createTemplateVersion(req.params.id, req.body);
      return ok(res, tmpl, 201);
    } catch (err) {
      next(err);
    }
  },

  async getTemplates(_req, res, next) {
    try {
      const all = await templateService.getTemplates();
      return ok(res, all);
    } catch (err) {
      next(err);
    }
  },

  async getTemplate(req, res, next) {
    try {
      const tmpl = await templateService.getTemplate(req.params.id);
      return ok(res, tmpl);
    } catch (err) {
      next(err);
    }
  },

  async getVersions(req, res, next) {
    try {
      const versions = await templateService.getVersions(req.params.id);
      return ok(res, versions);
    } catch (err) {
      next(err);
    }
  },
};
