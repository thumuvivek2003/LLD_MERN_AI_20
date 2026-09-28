import { Link } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu as MenuIcon, RefreshCw, Repeat } from 'lucide-react';
import cx from '../../utils/cx.js';
import { useUser } from '../../context/UserContext.jsx';
import { ROLE_LABEL } from '../../../shared/enums/role.enum.js';
import Avatar from '../ui/Avatar.jsx';
import Menu from '../ui/Menu.jsx';

/**
 * Console header: mobile menu button, page-level slot, alert bell, actor chip
 * with a "switch user" menu (there is no auth — see CONTRACT §2).
 */
export function TopBar({
  title,
  subtitle,
  children,
  alerts = 0,
  alertsTo,
  onMenuClick,
  onRefresh,
  dark = false,
}) {
  const { me, signOut } = useUser();

  return (
    <header
      className={cx(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur lg:px-6',
        dark ? 'border-white/5 bg-navy-950/90 text-slate-200' : 'border-slate-200 bg-white/90',
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className={cx(
          'flex h-8 w-8 items-center justify-center rounded-lg lg:hidden',
          dark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100',
        )}
      >
        <MenuIcon size={17} />
      </button>

      <div className="min-w-0 flex-1">
        {title && (
          <p className={cx('truncate text-sm font-semibold', dark ? 'text-white' : 'text-slate-900')}>
            {title}
          </p>
        )}
        {subtitle && <p className="truncate text-[11px] text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {children}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className={cx(
              'flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition',
              dark
                ? 'border-white/10 text-slate-300 hover:bg-white/10'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50',
            )}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        )}

        <BellSlot alerts={alerts} to={alertsTo} dark={dark} />

        <Menu
          items={[
            { id: 'switch', label: 'Switch user', icon: Repeat, onSelect: () => window.location.assign('/') },
            { id: 'signout', label: 'Sign out', icon: LogOut, tone: 'danger', onSelect: signOut },
          ]}
          trigger={
            <button
              type="button"
              className={cx(
                'flex items-center gap-2 rounded-lg border py-1 pl-1 pr-2 transition',
                dark
                  ? 'border-white/10 hover:bg-white/10'
                  : 'border-slate-200 bg-white hover:bg-slate-50',
              )}
            >
              <Avatar name={me?.name} initials={me?.avatarInitials} size="sm" />
              <span className="hidden text-left sm:block">
                <span
                  className={cx(
                    'block text-xs font-semibold leading-tight',
                    dark ? 'text-white' : 'text-slate-800',
                  )}
                >
                  {me?.name || 'Not signed in'}
                </span>
                <span className="block text-[10px] leading-tight text-slate-400">
                  {me ? ROLE_LABEL[me.role] : 'Pick a user'}
                </span>
              </span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
          }
        />
      </div>
    </header>
  );
}

/** Bell becomes a link only where an alerts page exists for that actor. */
function BellSlot({ alerts, to, dark }) {
  const className = cx(
    'relative flex h-8 w-8 items-center justify-center rounded-lg transition',
    dark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100',
  );
  const content = (
    <>
      <Bell size={16} />
      {alerts > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
          {alerts > 9 ? '9+' : alerts}
        </span>
      )}
    </>
  );
  return to ? (
    <Link to={to} className={className} aria-label="Alerts">
      {content}
    </Link>
  ) : (
    <span className={className} aria-label="Alerts">
      {content}
    </span>
  );
}

export default TopBar;
