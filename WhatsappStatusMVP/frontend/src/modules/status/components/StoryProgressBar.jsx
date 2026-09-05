// modules/status/components/StoryProgressBar.jsx — segmented progress at the
// top of the story viewer (one segment per status).
export function StoryProgressBar({ count, index, progress }) {
  return (
    <div className="flex gap-1 px-2 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
          />
        </div>
      ))}
    </div>
  );
}
