import { useNavigate } from 'react-router-dom';
import { useCurrentActorStore } from '../state/currentActor.store.js';
import { ACTOR_ROLES } from '../constants/notification.constants.js';
import { getAppRoutes } from '../../config/route.config.js';

const ROLE_OPTIONS = [
  { value: ACTOR_ROLES.USER, label: 'User', defaultId: 'u1' },
  { value: ACTOR_ROLES.ADMIN, label: 'Admin', defaultId: 'admin_1' },
  { value: ACTOR_ROLES.SYSTEM, label: 'System', defaultId: 'system_1' },
];

export function Topbar() {
  const { role, userId, setActor, setUserId } = useCurrentActorStore();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    const option = ROLE_OPTIONS.find((o) => o.value === newRole);
    const newId = option?.defaultId || userId;
    setActor(newRole, newId);
    const homeRoutes = getAppRoutes();
    navigate(homeRoutes[newRole]);
  };

  const current = ROLE_OPTIONS.find((o) => o.value === role);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-800">
          Welcome back, <span className="text-brand-600">{current?.label}</span>
        </h2>
        <p className="text-xs text-slate-500">
          Acting as <code className="font-mono">{userId}</code>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          className="input w-40"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="x-actor-id"
        />
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleRoleChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                role === opt.value
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
          {current?.label?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}
