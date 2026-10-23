import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const FloorsPage = () => (
  <PageContainer title="Floors" subtitle="Manage floors per parking lot">
    <Card>Floors are derived from slot floor numbers. Manage them via the Slots page.</Card>
  </PageContainer>
);
