// modules/status/components/FeedList.jsx — the two-section list
// ("Recent updates" = unseen, "Viewed updates" = seen). Screen 10.
import { FeedItem } from './FeedItem.jsx';

const SectionHeader = ({ children }) => (
  <h2 className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-wa-muted">{children}</h2>
);

export function FeedList({ sections, onOpen }) {
  const { recent, viewed } = sections;
  return (
    <div className="pb-4">
      {recent.length > 0 && (
        <>
          <SectionHeader>Recent updates</SectionHeader>
          {recent.map((m) => (
            <FeedItem key={m.user.id} model={m} onOpen={onOpen} />
          ))}
        </>
      )}
      {viewed.length > 0 && (
        <>
          <SectionHeader>Viewed updates</SectionHeader>
          {viewed.map((m) => (
            <FeedItem key={m.user.id} model={m} onOpen={onOpen} />
          ))}
        </>
      )}
    </div>
  );
}
