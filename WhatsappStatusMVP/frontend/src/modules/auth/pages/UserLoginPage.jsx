// modules/auth/pages/UserLoginPage.jsx — Screen 1: pick a user to continue.
import { useLogin } from '../hooks/useLogin.js';
import { UserList } from '../components/UserList.jsx';
import { Loader } from '../../../core/components/Loader.jsx';

export function UserLoginPage() {
  const { users, loading, error, selectedId, chooseUser } = useLogin();

  return (
    <div className="h-full flex flex-col bg-wa-ink">
      {/* Brand hero */}
      <div className="bg-gradient-to-b from-wa-dark to-wa-teal px-6 pt-10 pb-8 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-white/15 grid place-items-center mb-3 backdrop-blur">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Welcome 👋</h1>
        <p className="text-sm text-white/70 mt-1">Select a user to continue</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-3">
        {loading && <Loader label="Loading users…" />}
        {error && <p className="text-center text-red-400 text-sm py-8">{error}</p>}
        {!loading && !error && <UserList users={users} selectedId={selectedId} onSelect={chooseUser} />}
      </div>

      <p className="text-center text-xs text-wa-muted py-3 border-t border-wa-line">
        MVP login — no password, just pick who you are
      </p>
    </div>
  );
}
