import { NavLink } from 'react-router-dom';
import { useCurrentActorStore } from '../state/currentActor.store.js';
import { getSidebarItems } from '../../config/sidebar.config.js';
import { ACTOR_ROLES } from '../constants/notification.constants.js';

const ICONS = {
  home: '🏠',
  bell: '🔔',
  settings: '⚙️',
  inbox: '📥',
  refresh: '↻',
  chart: '📊',
  file: '📄',
  send: '➤',
  users: '👥',
  cpu: '⚡',
  rotate: '↺',
  clipboard: '📋',
};

const ACTOR_LABEL = {
  [ACTOR_ROLES.USER]: 'User Workspace',
  [ACTOR_ROLES.ADMIN]: 'Admin Console',
  [ACTOR_ROLES.SYSTEM]: 'System Operator',
};

export function Sidebar() {
  const role = useCurrentActorStore((s) => s.role);
  const items = getSidebarItems(role);

  return (
    <aside className="w-64 shrink-0 bg-sidebar-gradient text-white flex flex-col">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-lg">
            🔔
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Notify</div>
            <div className="text-[11px] text-white/70">{ACTOR_LABEL[role]}</div>
          </div>
        </div>
      </div>

      <nav className="px-3 mt-2 flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/user' || item.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-base w-5 text-center">
              {ICONS[item.icon] || '•'}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 m-3 rounded-xl bg-white/10 text-xs text-white/80">
        <div className="font-medium text-white mb-1">MVP build</div>
        Designed to teach Observer + Strategy + Retry patterns.
      </div>
    </aside>
  );
}
