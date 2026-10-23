import { useCallback, useState } from 'react';

export const useModal = (initial = false) => {
  const [open, setOpen] = useState(initial);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { open, show, hide, toggle };
};
