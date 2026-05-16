import { Route } from 'react-router-dom';
import { TemplateListPage } from '../modules/template/pages/TemplateListPage.jsx';
import { TemplateEditorPage } from '../modules/template/pages/TemplateEditorPage.jsx';
import { TemplateVersionHistoryPage } from '../modules/template/pages/TemplateVersionHistoryPage.jsx';
import { SendNotificationPage } from '../modules/notification/pages/SendNotificationPage.jsx';
import { SendGroupNotificationPage } from '../modules/notification/pages/SendGroupNotificationPage.jsx';
import { NotificationReviewPage } from '../modules/notification/pages/NotificationReviewPage.jsx';
import { QueueMonitorPage } from '../modules/system/pages/QueueMonitorPage.jsx';
import { RetryQueuePage } from '../modules/system/pages/RetryQueuePage.jsx';
import { DeliveryLogsPage } from '../modules/system/pages/DeliveryLogsPage.jsx';

// System actor routes — templates, compose, and operational pages.
export function SystemRoutes() {
  return [
    <Route key="tmpl-list" path="/templates" element={<TemplateListPage />} />,
    <Route key="tmpl-new" path="/templates/new" element={<TemplateEditorPage />} />,
    <Route key="tmpl-edit" path="/templates/:id" element={<TemplateEditorPage />} />,
    <Route
      key="tmpl-vers"
      path="/templates/:id/versions"
      element={<TemplateVersionHistoryPage />}
    />,
    <Route
      key="compose-send"
      path="/compose/send"
      element={<SendNotificationPage />}
    />,
    <Route
      key="compose-group"
      path="/compose/group"
      element={<SendGroupNotificationPage />}
    />,
    <Route
      key="compose-review"
      path="/compose/review"
      element={<NotificationReviewPage />}
    />,
    <Route key="sys-queue" path="/system/queue" element={<QueueMonitorPage />} />,
    <Route key="sys-retry" path="/system/retry" element={<RetryQueuePage />} />,
    <Route key="sys-logs" path="/system/logs" element={<DeliveryLogsPage />} />,
  ];
}
