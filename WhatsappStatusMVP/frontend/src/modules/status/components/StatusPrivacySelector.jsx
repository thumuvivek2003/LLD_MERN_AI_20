// modules/status/components/StatusPrivacySelector.jsx — Screen 4.
// The privacy options sheet. When a mode needs a user list, it hands off to the
// PrivacyUserSelector (Screens 5 & 6).
import { BottomSheet } from '../../../core/components/BottomSheet.jsx';
import { Button } from '../../../core/components/Button.jsx';
import { PRIVACY, PRIVACY_OPTIONS } from '../../../core/constants/privacy.constants.js';

export function StatusPrivacySelector({ open, onClose, privacy, onChange, onNeedUsers }) {
  const choose = (value) => {
    onChange(value);
    if (value === PRIVACY.CONTACTS_EXCEPT || value === PRIVACY.ONLY_SHARE_WITH) {
      onNeedUsers(value); // open the user selector next
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Status privacy">
      <p className="px-5 pb-2 text-sm text-wa-muted">Who can see my status updates</p>
      <div className="px-2 pb-3">
        {PRIVACY_OPTIONS.map((opt) => {
          const active = privacy === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => choose(opt.value)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-wa-panel2 text-left"
            >
              <span className="text-xl w-8 text-center">{opt.icon}</span>
              <span className="flex-1">
                <span className="block font-medium">{opt.title}</span>
                <span className="block text-xs text-wa-muted">{opt.subtitle}</span>
              </span>
              <span className={`h-5 w-5 rounded-full border-2 grid place-items-center ${active ? 'border-wa-green' : 'border-wa-line'}`}>
                {active && <span className="h-2.5 w-2.5 rounded-full bg-wa-green" />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="px-5 pb-6 pt-1">
        <Button className="w-full" onClick={onClose}>Done</Button>
      </div>
    </BottomSheet>
  );
}
