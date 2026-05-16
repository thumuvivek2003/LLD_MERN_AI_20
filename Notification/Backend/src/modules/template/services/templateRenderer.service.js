import { injectVariables } from '../../../shared/utils/template.util.js';

/**
 * Pure rendering — no IO. Given a template-version object and a payload,
 * returns { subject, body }. Re-used by:
 *   - mapper at read time (replay historical content)
 *   - workers at send time (so the channel strategy has rendered text)
 */
export const templateRendererService = {
  render(versionObj, payload) {
    if (!versionObj) return { subject: '', body: '' };
    return {
      subject: injectVariables(versionObj.subjectTemplate || '', payload || {}),
      body: injectVariables(versionObj.bodyTemplate || '', payload || {}),
    };
  },
};
