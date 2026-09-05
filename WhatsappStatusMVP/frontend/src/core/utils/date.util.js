// core/utils/date.util.js — formatTime()
// Human "Just now / 5m ago / 2h ago / Today, 10:30 AM" style labels.
export function timeAgo(dateLike) {
  const d = new Date(dateLike);
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 45) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return d.toLocaleDateString();
}

export function clockTime(dateLike) {
  return new Date(dateLike).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function todayClock(dateLike) {
  return `Today, ${clockTime(dateLike)}`;
}
