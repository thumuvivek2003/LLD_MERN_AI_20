// modules/status/components/PrivacyUserSelector.jsx — Screens 5 & 6.
// Multi-select contact list for "Contacts except…" / "Only share with…".
import { BottomSheet } from '../../../core/components/BottomSheet.jsx';
import { Button } from '../../../core/components/Button.jsx';
import { Avatar } from '../../../core/components/Avatar.jsx';
import { Loader } from '../../../core/components/Loader.jsx';
import { useFriends } from '../../friendship/hooks/useFriends.js';

export function PrivacyUserSelector({ open, onClose, mode, selected, onChange }) {
  const { friends, loading } = useFriends();
  const isExclude = mode === 'CONTACTS_EXCEPT';
  const title = isExclude ? 'Exclude contacts' : 'Only share with…';

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={`${title} · ${selected.length} selected`}>
      {loading ? (
        <Loader label="Loading contacts…" />
      ) : (
        <div className="px-2 pb-3">
          {friends.map((f) => {
            const checked = selected.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggle(f.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-wa-panel2 text-left"
              >
                <Avatar user={f} size={44} />
                <span className="flex-1 font-medium">{f.name}</span>
                <span className={`h-5 w-5 rounded-md border-2 grid place-items-center ${checked ? 'border-wa-green bg-wa-green' : 'border-wa-line'}`}>
                  {checked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B141A" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <div className="px-5 pb-6 pt-1">
        <Button className="w-full" onClick={onClose}>Done</Button>
      </div>
    </BottomSheet>
  );
}
