import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const PricingStrategiesPage = () => (
  <PageContainer title="Pricing Strategies" subtitle="Configure how fares are calculated">
    <div className="grid gap-4 sm:grid-cols-3">
      <Card title="Weekday Hourly"><p className="text-sm text-slate-600">Mon–Fri • Per-hour rate</p></Card>
      <Card title="Weekend Hourly"><p className="text-sm text-slate-600">Sat–Sun • Higher rate</p></Card>
      <Card title="Flat Day"><p className="text-sm text-slate-600">Single flat charge</p></Card>
    </div>
  </PageContainer>
);
