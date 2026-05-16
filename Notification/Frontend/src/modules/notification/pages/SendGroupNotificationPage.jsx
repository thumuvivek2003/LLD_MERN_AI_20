import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { NotificationComposer } from '../components/NotificationComposer.jsx';
import { useNotificationComposer } from '../hooks/useNotificationComposer.js';

export function SendGroupNotificationPage() {
  const navigate = useNavigate();
  const composer = useNotificationComposer();

  useEffect(() => {
    composer.setMode('group');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canProceed =
    composer.audience.length > 0 &&
    composer.channels.length > 0 &&
    !!composer.templateId;

  return (
    <DashboardLayout
      title="Send Group Notification"
      subtitle="Broadcast a single template to many users at once"
      actions={
        <button
          disabled={!canProceed}
          onClick={() => navigate('/compose/review')}
          className="btn-primary text-sm"
        >
          Review →
        </button>
      }
    >
      <NotificationComposer mode="group" />
    </DashboardLayout>
  );
}
