import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BarChart3,
  Bookmark,
  Clock,
  CircleHelp,
  History,
  LayoutGrid,
  Search,
  Settings,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';
import Sidebar, { SidebarBrand } from '../components/layout/Sidebar.jsx';
import TopBar from '../components/layout/TopBar.jsx';

/** Business console — light rail, emerald accent (mockup: business_screens). */
const SECTIONS = [
  {
    label: 'Home',
    items: [{ to: '/business', label: 'Dashboard', icon: UserRound, end: true }],
  },
  {
    label: 'Data',
    items: [
      { to: '/business/objects', label: 'My Objects', icon: LayoutGrid },
      { to: '/business/favorites', label: 'Favorites', icon: Star },
      { to: '/business/recent', label: 'Recent', icon: Clock },
    ],
  },
  {
    label: 'Work',
    items: [
      { to: '/business/search', label: 'Search', icon: Search },
      { to: '/business/views', label: 'My Views', icon: Bookmark },
      { to: '/business/reports', label: 'Reports', icon: BarChart3 },
      { to: '/business/activity', label: 'Activity', icon: History },
    ],
  },
  {
    label: '',
    items: [
      { to: '/business/help', label: 'Help', icon: CircleHelp },
      { to: '/business/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function BusinessLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div data-actor="business" className="flex min-h-screen bg-canvas">
      <Sidebar
        theme="light"
        sections={SECTIONS}
        open={navOpen}
        onNavigate={() => setNavOpen(false)}
        brand={<SidebarBrand icon={Sparkles} dark={false} subtitle="Work with your data" />}
      />

      {navOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setNavOpen(false)} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title="Business User"
          subtitle="Work with your data"
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default BusinessLayout;
