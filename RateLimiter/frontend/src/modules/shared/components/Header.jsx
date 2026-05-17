import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { ROUTES } from '../constants/routes.js';

export function Header({ title }) {
  const { user, clear } = useAuthStore();
  const navigate = useNavigate();

  const onLogout = () => {
    clear();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 text-sm">
            <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold">
              {(user.username || '?').slice(0, 1).toUpperCase()}
            </span>
            <div className="leading-tight">
              <div className="text-slate-800 font-medium">{user.username}</div>
              <div className="text-[11px] text-slate-400 uppercase">
                {user.role}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="btn-secondary text-xs"
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
