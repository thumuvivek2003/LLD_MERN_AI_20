import { getDirectionIcon, getDirectionColor } from '../../utils/directionIcon.js';

export default function DirectionIndicator({ direction, size = 16 }) {
  const Icon = getDirectionIcon(direction);
  const color = getDirectionColor(direction);
  return <Icon style={{ width: size, height: size }} className={color} />;
}
