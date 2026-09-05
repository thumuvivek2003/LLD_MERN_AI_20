// modules/friendship/hooks/useFriends.js — load the current user's friends
// (needed by the privacy selectors: "except…" / "only share with…").
import { useEffect, useState } from 'react';
import { friendshipApi } from '../services/friendship.api.js';

export function useFriends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    friendshipApi
      .getFriends()
      .then((data) => alive && setFriends(data))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { friends, loading };
}
