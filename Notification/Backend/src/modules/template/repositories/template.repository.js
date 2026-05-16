import { TemplateModel } from '../models/template.model.js';

export const templateRepository = {
  async create(template) {
    return TemplateModel.create(template);
  },

  async findById(id) {
    return TemplateModel.findById(id).lean();
  },

  async findAll() {
    return TemplateModel.find({}).sort({ createdAt: -1 }).lean();
  },

  async findActiveByEventAndChannel(eventType, channel) {
    return TemplateModel.findOne({ eventType, channel }).lean();
  },

  /**
   * Returns the exact version object for (templateId, version), needed by the
   * mapper to re-render historical notifications.
   */
  async findTemplateVersion(templateId, version) {
    const tmpl = await TemplateModel.findById(templateId).lean();
    if (!tmpl) return null;
    const v = tmpl.versions.find((x) => x.version === version);
    return v ? { ...v, templateId, channel: tmpl.channel, name: tmpl.name } : null;
  },

  async pushVersion(id, version) {
    return TemplateModel.findByIdAndUpdate(
      id,
      {
        $push: { versions: version },
        $set: { activeVersion: version.version },
      },
      { new: true },
    ).lean();
  },

  async deactivateAllVersions(id) {
    return TemplateModel.updateOne(
      { _id: id },
      { $set: { 'versions.$[].isActive': false } },
    );
  },
};
