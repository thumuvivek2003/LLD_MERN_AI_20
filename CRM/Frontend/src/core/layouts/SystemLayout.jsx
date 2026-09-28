import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Activity,
  Bell,
  Bot,
  BriefcaseBusiness,
  Cable,
  Database,
  FileClock,
  Gauge,
  HardDrive,
  Layers,
  Link2,
  Lock,
  ScrollText,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar.jsx';
import TopBar from '../components/layout/TopBar.jsx';
import useAsync from '../hooks/useAsync.js';
import systemApi from '../api/system.api.js';

/** System console — dark navy rail, indigo accent (mockup: system_screens). */
const SECTIONS = [
  { label: 'Overview', items: [{ to: '/system', label: 'System Dashboard', icon: Gauge, end: true }] },
  {
    label: 'Operations',
    items: [
      { to: '/system/indexes', label: 'Index Management', icon: Database },
      { to: '/system/events', label: 'Event Monitor', icon: Activity },
      { to: '/system/jobs', label: 'Background Jobs', icon: BriefcaseBusiness },
      { to: '/system/lookups', label: 'Lookup Resolver', icon: Link2 },
      { to: '/system/validation', label: 'Validation Engine', icon: ShieldCheck },
    ],
  },
  {
    label: 'Data & Cache',
    items: [
      { to: '/system/cache', label: 'Metadata Cache', icon: Layers },
      { to: '/system/data', label: 'Data Overview', icon: HardDrive },
    ],
  },
  {
    label: 'Observability',
    items: [
      { to: '/system/audit', label: 'Audit Logs', icon: FileClock },
      { to: '/system/logs', label: 'System Logs', icon: ScrollText },
      { to: '/system/alerts', label: 'Alerts & Notifications', icon: Bell },
      { to: '/system/metrics', label: 'Metrics', icon: Activity },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { to: '/system/settings', label: 'System Settings', icon: Settings },
      { to: '/system/integrations', label: 'Integrations', icon: Cable },
      { to: '/system/security', label: 'Security', icon: Lock },
    ],
  },
];

export function SystemLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { data: health } = useAsync(() => systemApi.health(), []);
  const { data: alerts } = useAsync(() => systemApi.alerts(), [], { initialData: [] });

  const healthy = health?.status === 'Healthy';
  const unacked = (Array.isArray(alerts) ? alerts : []).filter((alert) => !alert.acknowledged).length;

  return (
    <div data-actor="system" className="flex min-h-screen bg-canvas">
      <Sidebar
        theme="dark"
        sections={SECTIONS}
        open={navOpen}
        onNavigate={() => setNavOpen(false)}
        brand={
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-700 text-white">
              <Bot size={19} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-white">System Console</p>
              <p className="truncate text-[10px] text-slate-400">Background Ops & Health</p>
            </div>
          </div>
        }
        footer={
          <div className="rounded-xl bg-white/5 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${healthy ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`}
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">System Status</p>
                <p className="truncate text-[10px] text-slate-400">
                  {health ? (healthy ? 'All Systems Operational' : 'Degraded performance') : 'Checking…'}
                </p>
              </div>
            </div>
          </div>
        }
      />

      {navOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setNavOpen(false)} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title="System Console"
          subtitle="Background operations & system health"
          alerts={unacked}
          alertsTo="/system/alerts"
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SystemLayout;
