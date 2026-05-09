import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const open = (d = null) => { setData(d); setIsOpen(true); };
  const close = () => { setData(null); setIsOpen(false); };
  return { isOpen, data, open, close };
};
