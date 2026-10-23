import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../../services/parking.service.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Loader } from '../../components/ui/Loader.jsx';

const Stat = ({ label, value }) => (
  <Card>
    <div className="text-xs uppercase text-slate-500">{label}</div>
    <div className="mt-1 text-3xl font-semibold text-slate-900">{value}</div>
  </Card>
);

export const DashboardPage = () => {
  const { data: lots = [], isLoading } = useQuery({ queryKey: ['lots'], queryFn: parkingService.listLots });

  if (isLoading) return <Loader />;

  return (
    <PageContainer title="Dashboard" subtitle="Overview of your parking system">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Parking lots" value={lots.length} />
        <Stat label="Active tickets" value="—" />
        <Stat label="Today's revenue" value="—" />
        <Stat label="Slots available" value="—" />
      </div>
    </PageContainer>
  );
};
