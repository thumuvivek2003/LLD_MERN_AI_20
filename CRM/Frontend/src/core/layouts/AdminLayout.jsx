import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Database,
  FileClock,
  Gauge,
  LayoutGrid,
  ListTree,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Table2,
  Users,
  Workflow,
} from 'lucide-react';
import Sidebar, { SidebarBrand } from '../components/layout/Sidebar.jsx';
import TopBar from '../components/layout/TopBar.jsx';

/** Platform Admin console — dark navy rail, indigo accent (mockup: platform_admin_screens). */
const SECTIONS = [
  {
    label: '',
    items: [{ to: '/admin', label: 'Dashboard', icon: Gauge, end: true }],
  },
  {
    label: 'Metadata',
    items: [
      { to: '/admin/objects', label: 'Objects', icon: LayoutGrid },
      { to: '/admin/fields', label: 'Fields', icon: ListTree },
      { to: '/admin/relationships', label: 'Relationships', icon: Workflow },
      { to: '/admin/indexes', label: 'Indexes', icon: Database },
      { to: '/admin/validation-rules', label: 'Validation Rules', icon: ShieldCheck },
    ],
  },
  {
    label: 'Data',
    items: [
      { to: '/admin/records', label: 'Records', icon: Table2 },
      { to: '/admin/search', label: 'Search', icon: Search },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/users', label: 'Users & Roles', icon: Users },
      { to: '/admin/audit', label: 'Audit Logs', icon: FileClock },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div data-actor="admin" className="flex min-h-screen bg-canvas">
      <Sidebar
        theme="dark"
        sections={SECTIONS}
        open={navOpen}
        onNavigate={() => setNavOpen(false)}
        brand={<SidebarBrand icon={Sparkles} subtitle="Platform Admin" />}
        footer={
          <p className="px-2 text-[10px] leading-relaxed text-slate-500">
            © {new Date().getFullYear()} MetaForce Platform
          </p>
        }
      />

      {navOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setNavOpen(false)} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title="Platform Admin"
          subtitle="All actions & screens"
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
