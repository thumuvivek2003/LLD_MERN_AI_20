let portal = null;

const ensurePortal = () => {
  if (portal) return portal;
  portal = document.createElement('div');
  portal.id = 'toast-portal';
  portal.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2';
  document.body.appendChild(portal);
  return portal;
};

const show = (message, type) => {
  const root = ensurePortal();
  const node = document.createElement('div');
  const color = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';
  node.className = `${color} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm max-w-xs animate-pulse`;
  node.textContent = message;
  root.appendChild(node);
  setTimeout(() => node.remove(), 3000);
};

export const showSuccessToast = (msg) => show(msg, 'success');
export const showErrorToast = (msg) => show(msg, 'error');
export const showInfoToast = (msg) => show(msg, 'info');
