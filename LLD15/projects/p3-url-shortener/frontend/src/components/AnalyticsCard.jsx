const ICON_MAP = {
  "Total Clicks": "⚡",
  "Mobile Users": "📱",
  "Desktop Users": "🖥",
};

export default function AnalyticsCard({ title, value }) {
  const icon = ICON_MAP[title] ?? "📊";

  return (
    <div className="analytics-card">
      <div className="analytics-card__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="analytics-card__label">{title}</p>
      <p className="analytics-card__value">{value.toLocaleString()}</p>
    </div>
  );
}