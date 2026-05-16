import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { PreferenceToggleCard } from '../components/PreferenceToggleCard.jsx';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences.js';
import { CHANNELS } from '../../../shared/constants/notification.constants.js';

const KEY_MAP = {
  EMAIL: 'emailEnabled',
  SMS: 'smsEnabled',
  PUSH: 'pushEnabled',
};

export function NotificationPreferencesPage() {
  const { preferences, update, loading, error } = useNotificationPreferences();

  return (
    <DashboardLayout
      title="Notification Preferences"
      subtitle="Decide which channels we may reach you on"
    >
      {loading && !preferences && <Loader />}
      {error && (
        <div className="card p-4 text-sm text-red-700 bg-red-50 border-red-100">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHANNELS.map((channel) => {
          const key = KEY_MAP[channel.key];
          const enabled = !!preferences?.[key];
          return (
            <PreferenceToggleCard
              key={channel.key}
              channel={channel}
              enabled={enabled}
              onToggle={(v) => update({ [key]: v })}
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
}
