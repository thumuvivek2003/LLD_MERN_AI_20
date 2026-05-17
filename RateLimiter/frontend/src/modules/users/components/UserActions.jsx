import { Link } from 'react-router-dom';
import { clientDetailsPath } from '../../shared/constants/routes.js';

export function UserActions({ user, onReset, onBlock, onUnblock, busy }) {
  const blocked = (user.status || '').toLowerCase() === 'blocked';
  return (
    <div className="flex items-center justify-end gap-2 text-xs">
      <button
        type="button"
        onClick={() => onReset(user.clientId)}
        className="btn-secondary px-2 py-1"
        disabled={busy}
      >
        Reset
      </button>
      {blocked ? (
        <button
          type="button"
          onClick={() => onUnblock(user.clientId)}
          className="btn-secondary px-2 py-1"
          disabled={busy}
        >
          Unblock
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onBlock(user.clientId)}
          className="btn-danger px-2 py-1"
          disabled={busy}
        >
          Block
        </button>
      )}
      <Link
        to={clientDetailsPath(user.clientId)}
        className="text-brand-600 hover:underline"
      >
        View
      </Link>
    </div>
  );
}

export default UserActions;
