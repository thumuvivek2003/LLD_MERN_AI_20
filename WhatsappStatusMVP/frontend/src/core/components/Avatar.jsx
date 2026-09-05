// core/components/Avatar.jsx — colored initials avatar with optional story ring.
import { colorForId, initials } from '../utils/color.util.js';

export function Avatar({ user, size = 44, ring = 'none' }) {
  // ring: 'none' | 'unseen' | 'seen'
  const ringClass =
    ring === 'unseen'
      ? 'p-[2.5px] bg-gradient-to-tr from-wa-green to-wa-teal'
      : ring === 'seen'
      ? 'p-[2.5px] bg-wa-line'
      : 'p-0';

  return (
    <div className={`rounded-full ${ringClass} shrink-0`}>
      <div
        className="rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-wa-panel"
        style={{ width: size, height: size, backgroundColor: colorForId(user?.id), fontSize: size * 0.38 }}
      >
        {initials(user?.name)}
      </div>
    </div>
  );
}
