// modules/status/components/ViewerItem.jsx — one viewer row (Screen 11).
import { Avatar } from '../../../core/components/Avatar.jsx';

export function ViewerItem({ viewer }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Avatar user={viewer} size={42} />
      <span className="flex-1 font-medium">{viewer.name}</span>
      <span className="text-xs text-wa-muted">{viewer.timeLabel}</span>
    </div>
  );
}
