export function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="border-b border-wa-border bg-wa-light px-4 py-3 text-xs font-semibold uppercase tracking-wide text-wa-muted">
        Settings
      </div>
      <div className="p-6 text-sm text-wa-muted">
        <p>This is the MVP — settings will live here later.</p>
        <ul className="mt-4 list-disc space-y-1 pl-5">
          <li>Notifications (coming soon)</li>
          <li>Theme (coming soon)</li>
          <li>Privacy (coming soon)</li>
        </ul>
      </div>
    </div>
  );
}
