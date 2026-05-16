import { templateRepository } from '../repositories/template.repository.js';
import { validateTemplate } from '../validators/template.validator.js';
import { templateVersionService } from './templateVersion.service.js';
import { generateId } from '../../../shared/utils/id.util.js';
import { AppException } from '../../../shared/exceptions/app.exception.js';

function toTemplateDTO(t) {
  if (!t) return null;
  return {
    id: t._id,
    name: t.name,
    eventType: t.eventType,
    channel: t.channel,
    activeVersion: t.activeVersion,
    versions: (t.versions || []).map((v) => ({
      version: v.version,
      subjectTemplate: v.subjectTemplate,
      bodyTemplate: v.bodyTemplate,
      isActive: !!v.isActive,
      createdAt: v.createdAt,
    })),
  };
}

export const templateService = {
  toTemplateDTO,

  async createTemplate(payload) {
    const safe = validateTemplate(payload);
    const _id = generateId('t');
    const created = await templateRepository.create({
      _id,
      name: safe.name,
      eventType: safe.eventType,
      channel: safe.channel,
      activeVersion: 1,
      versions: [
        {
          version: 1,
          subjectTemplate: safe.subjectTemplate,
          bodyTemplate: safe.bodyTemplate,
          isActive: true,
          createdAt: new Date(),
        },
      ],
    });
    return toTemplateDTO(created.toObject ? created.toObject() : created);
  },

  async createTemplateVersion(templateId, payload) {
    await templateVersionService.createVersion(templateId, payload);
    const fresh = await templateRepository.findById(templateId);
    return toTemplateDTO(fresh);
  },

  async getTemplates() {
    const all = await templateRepository.findAll();
    return all.map(toTemplateDTO);
  },

  async getTemplate(id) {
    const t = await templateRepository.findById(id);
    if (!t) throw new AppException('TEMPLATE_NOT_FOUND', `Template ${id} not found`, 404);
    return toTemplateDTO(t);
  },

  async getVersions(id) {
    const t = await templateRepository.findById(id);
    if (!t) throw new AppException('TEMPLATE_NOT_FOUND', `Template ${id} not found`, 404);
    return (t.versions || [])
      .slice()
      .sort((a, b) => b.version - a.version)
      .map((v) => ({
        version: v.version,
        subjectTemplate: v.subjectTemplate,
        bodyTemplate: v.bodyTemplate,
        isActive: !!v.isActive,
        createdAt: v.createdAt,
      }));
  },

  /**
   * Returns the active template + active version for (eventType, channel).
   * Used by the notification orchestrator at trigger time.
   */
  async getActiveTemplate(eventType, channel) {
    const t = await templateRepository.findActiveByEventAndChannel(eventType, channel);
    if (!t) return null;
    const active = (t.versions || []).find((v) => v.version === t.activeVersion);
    if (!active) return null;
    return {
      templateId: t._id,
      version: active.version,
      channel: t.channel,
      eventType: t.eventType,
      subjectTemplate: active.subjectTemplate,
      bodyTemplate: active.bodyTemplate,
    };
  },
};
