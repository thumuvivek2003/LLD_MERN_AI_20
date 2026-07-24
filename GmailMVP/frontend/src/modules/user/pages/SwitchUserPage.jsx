import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../shared/context/UserContext.jsx';
import UserList from '../components/UserList.jsx';
import Button from '../../../shared/components/Button.jsx';
import { Spinner } from '../../../shared/components/Loader.jsx';
import { InboxIcon, UsersIcon } from '../../../shared/components/Icons.jsx';

export default function SwitchUserPage() {
  const { users, currentUser, loading, error, switchUser, loadUsers } =
    useUser();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  // Preselect the persisted user if present.
  useEffect(() => {
    if (currentUser) setSelected(currentUser);
  }, [currentUser]);

  const cont = () => {
    if (!selected) return;
    switchUser(selected);
    navigate('/inbox');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-soft">
            <InboxIcon size={28} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Welcome to <span className="brand-text">Mailbox</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a user to sign in and start emailing.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <UsersIcon size={18} className="text-brand-500" />
            Select User
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size={26} />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
              <p className="font-medium">Couldn&apos;t load users.</p>
              <p className="mt-1 text-xs text-red-400">{error}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={loadUsers}
              >
                Retry
              </Button>
            </div>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No users available. Start the backend to seed users.
            </p>
          ) : (
            <UserList
              users={users}
              selectedId={selected?.id}
              onSelect={setSelected}
            />
          )}

          <Button
            size="lg"
            className="mt-6 w-full"
            disabled={!selected}
            onClick={cont}
          >
            Continue
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Multi-user demo &middot; no password required
        </p>
      </div>
    </div>
  );
}
