// modules/status/hooks/useStatusFeed.js — exposes the feed split into sections.
import { useEffect, useMemo } from 'react';
import { useStatusContext } from '../state/StatusProvider.jsx';
import { toFeedSections } from '../mappers/status.mapper.js';

export function useStatusFeed() {
  const { feed, loading, error, loadFeed } = useStatusContext();

  // Silently re-sync whenever the feed screen mounts (e.g. coming back from the
  // story viewer) so just-seen statuses move to "Viewed" without a manual pull.
  useEffect(() => {
    loadFeed({ silent: true });
  }, [loadFeed]);

  const sections = useMemo(() => toFeedSections(feed), [feed]);
  return { sections, loading, error, refresh: loadFeed, isEmpty: feed.length === 0 };
}
