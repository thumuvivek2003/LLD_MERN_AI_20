import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Loader2, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useUser } from '../../core/context/UserContext.jsx';
import { ROLE, ROLE_HOME, ROLE_LABEL } from '../../shared/enums/role.enum.js';
import { ErrorState } from '../../core/components/ui/EmptyState.jsx';
import { Skeleton } from '../../core/components/ui/Skeleton.jsx';
import Avatar from '../../core/components/ui/Avatar.jsx';
import cx from '../../core/utils/cx.js';

const PERSONA = {
  [ROLE.PLATFORM_ADMIN]: {
    icon: ShieldCheck,
    accent: 'admin',
    tint: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    blurb: 'Model objects, fields, indexes and permissions.',
  },
  [ROLE.BUSINESS_USER]: {
    icon: UserRound,
    accent: 'business',
    tint: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    blurb: 'Work with records, views, reports and imports.',
  },
  [ROLE.SYSTEM]: {
    icon: Bot,
    accent: 'system',
    tint: 'bg-slate-100 text-slate-600 ring-slate-200',
    blurb: 'Watch jobs, events, cache and platform health.',
  },
};

/**
 * There is no login (CONTRACT §2) — you pick which seeded user you are acting as.
 * The pick lands in localStorage and every request carries it as `x-user-id`.
 */
export function UserSwitcherPage() {
  const { users, loading, error, signInAs, me, userId } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (me && userId) navigate(ROLE_HOME[me.role] || '/admin', { replace: true });
  }, [me, userId, navigate]);

  const pick = async (user) => {
    await signInAs(user.userId);
    navigate(ROLE_HOME[user.role] || '/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-canvas px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-9 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-pop">
            <Sparkles size={26} />
          </span>
          <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">MetaForce</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Metadata-driven CRM platform. Choose who you want to work as — there is no password.
          </p>
        </header>

        {error && !users.length ? (
          <div className="mf-card">
            <ErrorState error={error} onRetry={() => window.location.reload()} />
          </div>
        ) : loading && !users.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mf-card flex items-center gap-4 p-5">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {users.map((user) => {
              const persona = PERSONA[user.role] || PERSONA[ROLE.BUSINESS_USER];
              const Icon = persona.icon;
              return (
                <button
                  key={user.userId}
                  type="button"
                  data-actor={persona.accent}
                  onClick={() => pick(user)}
                  className="mf-card group flex items-center gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-pop"
                >
                  <Avatar name={user.name} initials={user.avatarInitials} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {user.title || ROLE_LABEL[user.role]}
                    </p>
                    <span
                      className={cx(
                        'mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset',
                        persona.tint,
                      )}
                    >
                      <Icon size={11} />
                      {user.role.replace('_', ' ')}
                    </span>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{persona.blurb}</p>
                  </div>
                  <ArrowRight
                    size={17}
                    className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </button>
              );
            })}
          </div>
        )}

        {loading && users.length > 0 && (
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 size={13} className="animate-spin" /> Signing you in…
          </p>
        )}
      </div>
    </div>
  );
}

export default UserSwitcherPage;
