import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Boxes, Layers3, ListChecks, GitBranch, ScrollText, Settings } from 'lucide-react';
import { useElevatorStore } from '../../modules/elevator/store/elevator.store.js';
import { useElevatorSocketSync } from '../../modules/elevator/hooks/useElevatorSocketSync.js';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/elevators', label: 'Elevators', icon: Boxes },
  { to: '/floors', label: 'Floors', icon: Layers3 },
  { to: '/requests', label: 'Requests', icon: ListChecks },
  { to: '/strategy', label: 'Strategy', icon: GitBranch },
  { to: '/logs', label: 'Logs', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  useElevatorSocketSync();
  const stats = useElevatorStore((s) => s.stats);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <aside className="w-56 border-r border-slate-800 bg-slate-950/60 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="text-sm font-bold tracking-widest text-indigo-300">ELEVATOR</div>
          <div className="text-xs text-slate-400 tracking-wider">CONTROL SYSTEM</div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  isActive ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/80">
          <h1 className="text-lg font-semibold tracking-wide">ELEVATOR CONTROL SYSTEM</h1>
          <div className="flex items-center gap-3 text-xs">
            <Chip label="People Inside" value={stats.peopleInside ?? 0} />
            <Chip label="Active Requests" value={stats.activeRequests ?? 0} />
            <Chip label="Total Requests" value={stats.totalRequests ?? 0} />
            <Chip label="Efficiency" value={`${stats.efficiency ?? 0}%`} />
            <span className="flex items-center gap-1.5 ml-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot" /> Live
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <div className="px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700/60">
      <span className="text-slate-400 mr-2">{label}</span>
      <span className="font-semibold text-slate-100">{value}</span>
    </div>
  );
}
