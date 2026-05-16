import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { NotificationComposer } from '../components/NotificationComposer.jsx';
import { useNotificationComposer } from '../hooks/useNotificationComposer.js';

export function SendNotificationPage() {
  const navigate = useNavigate();
  const composer = useNotificationComposer();

  useEffect(() => {
    composer.setMode('single');
    // Clamp audience to one user in single mode.
    if (composer.audience.length > 1) {
      composer.setAudience([composer.audience[0]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canProceed =
    composer.audience.length === 1 &&
    composer.channels.length > 0 &&
    !!composer.templateId;

  return (
    <DashboardLayout
      title="Send Notification"
      subtitle="Compose a one-off notification for a single user"
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
      <NotificationComposer mode="single" />
    </DashboardLayout>
  );
}
