import { NavLink } from 'react-router-dom';
import cx from '../../utils/cx.js';

/**
 * Shared sidebar shell. `sections` = `[{ label, items: [{ to, label, icon, end, badge }] }]`.
 * `theme` = 'dark' (Admin + System) | 'light' (Business), matching the mockups.
 */
export function Sidebar({ brand, sections = [], theme = 'dark', footer, open, onNavigate }) {
  const dark = theme === 'dark';

  return (
    <aside
      className={cx(
        'fixed inset-y-0 left-0 z-40 flex w-60 flex-col transition-transform lg:static lg:translate-x-0',
        dark ? 'bg-navy-900 text-slate-300' : 'border-r border-slate-200 bg-white text-slate-600',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className={cx('shrink-0 px-4 py-4', dark ? 'border-b border-white/5' : 'border-b border-slate-100')}>
        {brand}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label || 'root'}>
            {section.label && (
              <p className={cx('mf-section-label mb-1.5', dark ? 'text-slate-500' : 'text-slate-400')}>
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cx(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition',
                        isActive
                          ? dark
                            ? 'bg-accent text-white shadow-sm'
                            : 'bg-accent-soft font-semibold text-accent-ink'
                          : dark
                            ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      )
                    }
                  >
                    {item.icon && <item.icon size={16} strokeWidth={1.9} />}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge !== null && (
                      <span
                        className={cx(
                          'rounded px-1.5 py-0.5 text-[10px] font-bold',
                          dark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && (
        <div className={cx('shrink-0 p-3', dark ? 'border-t border-white/5' : 'border-t border-slate-100')}>
          {footer}
        </div>
      )}
    </aside>
  );
}

/** MetaForce wordmark used in all three sidebars. */
export function SidebarBrand({ icon: Icon, dark = true, subtitle }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cx(
          'flex h-8 w-8 items-center justify-center rounded-lg',
          dark ? 'bg-accent text-white' : 'bg-navy-900 text-white',
        )}
      >
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className={cx('truncate text-[15px] font-bold', dark ? 'text-white' : 'text-slate-900')}>
          MetaForce
        </p>
        {subtitle && <p className="truncate text-[10px] text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default Sidebar;
