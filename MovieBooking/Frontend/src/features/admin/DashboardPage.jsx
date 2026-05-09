import DashboardStats from './components/DashboardStats.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useDashboard } from './useDashboard.js';

export default function DashboardPage() {
  const { stats, loading } = useDashboard();

  if (loading) return <Loader />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#a0a0b0', marginBottom: 24 }}>Overview of your cinema system</p>
      <DashboardStats stats={stats} />
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #2a2a3e' }}>
        <p style={{ color: '#a0a0b0', textAlign: 'center', padding: 20 }}>Recent activity will appear here</p>
      </div>
    </div>
  );
}
