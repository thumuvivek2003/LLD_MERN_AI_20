import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../../../shared/context/UserContext.jsx';
import { MailService } from '../../../shared/services/MailService.js';
import { useSocket } from '../../../shared/hooks/useSocket.js';
import { MailViewModelFactory } from '../../../shared/factory/MailViewModelFactory.js';

/**
 * Loads inbox or sent mail for the current user and, for the inbox, prepends
 * newly arriving mail from the real-time socket stream.
 * @param {'inbox'|'sent'} box
 */
export function useMail(box = 'inbox') {
  const { currentUser } = useUser();
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data =
        box === 'sent'
          ? await MailService.sent(currentUser.id)
          : await MailService.inbox(currentUser.id);
      setMails(data);
    } catch (e) {
      setError(e.message || 'Failed to load mail');
    } finally {
      setLoading(false);
    }
  }, [box, currentUser?.id]);

  useEffect(() => {
    load();
  }, [load]);

  // Real-time: prepend incoming mail to the inbox.
  const onIncoming = useCallback(
    (dto) => {
      if (box !== 'inbox') return;
      const vm = MailViewModelFactory.fromDTO(dto, { context: 'inbox' });
      if (!vm) return;
      setMails((prev) => {
        if (prev.some((m) => m.id === vm.id)) return prev;
        return [vm, ...prev];
      });
    },
    [box]
  );
  useSocket(onIncoming);

  const unreadCount = MailService.countUnread(mails);

  return { mails, loading, error, reload: load, unreadCount, setMails };
}

export default useMail;
