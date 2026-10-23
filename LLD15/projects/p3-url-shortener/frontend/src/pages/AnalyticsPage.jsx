import AnalyticsCard from "../components/AnalyticsCard";

export default function AnalyticsPage() {
  const analytics = {
    clicks: 120,
    mobile: 80,
    desktop: 40,
  };

  return (
    <section>
      <h2 className="section-heading">Analytics</h2>
      <div className="analytics-grid">
        <AnalyticsCard title="Total Clicks" value={analytics.clicks} />
        <AnalyticsCard title="Mobile Users" value={analytics.mobile} />
        <AnalyticsCard title="Desktop Users" value={analytics.desktop} />
      </div>
    </section>
  );
}