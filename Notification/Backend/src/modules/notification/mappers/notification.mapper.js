import { templateRepository } from '../../template/repositories/template.repository.js';
import { templateRendererService } from '../../template/services/templateRenderer.service.js';
import { userRepository } from '../../user/repositories/user.repository.js';

/**
 * Re-renders a notification at read time from (templateId, templateVersion,
 * payloadSnapshot). Falls back to customSubject/customBody for admin-sent
 * notifications without a template.
 */
async function rehydrateRendered(notification) {
  if (notification.customSubject != null || notification.customBody != null) {
    return {
      subject: notification.customSubject ?? '',
      body: notification.customBody ?? '',
    };
  }
  if (!notification.templateId || notification.templateVersion == null) {
    return { subject: '', body: '' };
  }
  const versionObj = await templateRepository.findTemplateVersion(
    notification.templateId,
    notification.templateVersion,
  );
  return templateRendererService.render(versionObj, notification.payloadSnapshot || {});
}

function shapeAttempts(attempts = []) {
  return attempts.map((a) => ({
    at: a.at instanceof Date ? a.at.toISOString() : new Date(a.at).toISOString(),
    status: a.status,
    error: a.error || undefined,
  }));
}

export async function toNotificationResponse(notification) {
  if (!notification) return null;
  const [rendered, user] = await Promise.all([
    rehydrateRendered(notification),
    userRepository.findById(notification.userId).catch(() => null),
  ]);
  return {
    id: notification._id,
    userId: notification.userId,
    user: user
      ? { id: user._id, name: user.name, email: user.email, phone: user.phone }
      : undefined,
    templateId: notification.templateId || null,
    templateVersion: notification.templateVersion ?? null,
    channel: notification.channel,
    eventType: notification.eventType,
    status: notification.status,
    payloadSnapshot: notification.payloadSnapshot || {},
    renderedPreview: rendered,
    retryCount: notification.retryCount || 0,
    attempts: shapeAttempts(notification.attempts || []),
    createdAt:
      notification.createdAt instanceof Date
        ? notification.createdAt.toISOString()
        : notification.createdAt,
    updatedAt:
      notification.updatedAt instanceof Date
        ? notification.updatedAt.toISOString()
        : notification.updatedAt,
  };
}

export async function toNotificationResponseList(notifications) {
  return Promise.all(notifications.map(toNotificationResponse));
}
