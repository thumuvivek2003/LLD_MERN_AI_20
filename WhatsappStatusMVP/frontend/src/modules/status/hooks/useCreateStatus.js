// modules/status/hooks/useCreateStatus.js — composer logic + submit.
import { useState } from 'react';
import { statusApi } from '../services/status.api.js';
import { PRIVACY } from '../../../core/constants/privacy.constants.js';

const BACKGROUNDS = ['teal', 'maroon', 'indigo', 'sunset', 'forest', 'ocean', 'purple', 'slate'];

export function useCreateStatus() {
  const [text, setText] = useState('');
  const [background, setBackground] = useState('maroon');
  const [privacy, setPrivacy] = useState(PRIVACY.EVERYONE);
  const [includeUsers, setIncludeUsers] = useState([]);
  const [excludeUsers, setExcludeUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const cycleBackground = () => {
    const i = BACKGROUNDS.indexOf(background);
    setBackground(BACKGROUNDS[(i + 1) % BACKGROUNDS.length]);
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        text: text.trim(),
        background,
        privacy,
        includeUsers: privacy === PRIVACY.ONLY_SHARE_WITH ? includeUsers : [],
        excludeUsers: privacy === PRIVACY.CONTACTS_EXCEPT ? excludeUsers : [],
      };
      await statusApi.createStatus(payload);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    text, setText,
    background, cycleBackground,
    privacy, setPrivacy,
    includeUsers, setIncludeUsers,
    excludeUsers, setExcludeUsers,
    submitting, error, submit,
    canSubmit: text.trim().length > 0 && !submitting,
  };
}
