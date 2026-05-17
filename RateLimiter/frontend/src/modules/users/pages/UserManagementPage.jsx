import { useState } from 'react';
import { useUsers, useUserActions } from '../hooks/useUsers.js';
import { UserTable } from '../components/UserTable.jsx';
import { Loader } from '../../shared/components/Loader.jsx';
import { EmptyState } from '../../shared/components/EmptyState.jsx';
import { Modal } from '../../shared/components/Modal.jsx';
import { Button } from '../../shared/components/Button.jsx';
import { useModal } from '../../shared/hooks/useModal.js';

function CreateClientForm({ onSubmit, busy, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!username || !password) return;
        onSubmit({ username: username.trim(), password });
      }}
      className="space-y-3"
    >
      <div>
        <label className="label">Username</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="new-client"
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={busy === 'create'}>
          Create
        </Button>
      </div>
    </form>
  );
}

export function UserManagementPage() {
  const { users, loading, error, refresh } = useUsers();
  const { run, busy, error: actionError } = useUserActions(refresh);
  const createModal = useModal();

  if (loading) return <Loader />;
  if (error) {
    return (
      <EmptyState title="Could not load clients" description={error} />
    );
  }

  const handleCreate = async (payload) => {
    try {
      await run('create', null, payload);
      createModal.hide();
    } catch (_) {
      // surfaced via actionError
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">Clients</h2>
        <Button onClick={createModal.show}>+ Create Client</Button>
      </div>

      {actionError && (
        <div className="text-sm text-red-600 mb-3">{actionError}</div>
      )}

      {users.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Create your first client to start sending requests."
        />
      ) : (
        <UserTable
          users={users}
          onReset={(id) => run('reset', id)}
          onBlock={(id) => run('block', id)}
          onUnblock={(id) => run('unblock', id)}
          busy={busy}
        />
      )}

      <Modal
        open={createModal.open}
        title="Create Client"
        onClose={createModal.hide}
      >
        <CreateClientForm
          onSubmit={handleCreate}
          busy={busy ? 'create' : null}
          error={actionError}
        />
      </Modal>
    </div>
  );
}

export default UserManagementPage;
