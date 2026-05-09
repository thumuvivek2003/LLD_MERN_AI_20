import { useEffect } from 'react';

export default function SuccessToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [message]);

  if (!message) return null;
  return <div className="toast success">{message}</div>;
}
