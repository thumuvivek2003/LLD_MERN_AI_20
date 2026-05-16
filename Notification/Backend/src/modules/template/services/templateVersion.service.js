import { templateRepository } from '../repositories/template.repository.js';
import { AppException } from '../../../shared/exceptions/app.exception.js';
import { validateNewVersion } from '../validators/template.validator.js';

export const templateVersionService = {
  async createVersion(templateId, payload) {
    const safe = validateNewVersion(payload);
    const existing = await templateRepository.findById(templateId);
    if (!existing) throw new AppException('TEMPLATE_NOT_FOUND', `Template ${templateId} not found`, 404);

    const nextVersion = (existing.versions || []).reduce((m, v) => Math.max(m, v.version), 0) + 1;

    // Mark every previous version as inactive (immutable text stays untouched).
    await templateRepository.deactivateAllVersions(templateId);

    const versionObj = {
      version: nextVersion,
      subjectTemplate: safe.subjectTemplate,
      bodyTemplate: safe.bodyTemplate,
      isActive: true,
      createdAt: new Date(),
    };
    await templateRepository.pushVersion(templateId, versionObj);
    return versionObj;
  },
};
