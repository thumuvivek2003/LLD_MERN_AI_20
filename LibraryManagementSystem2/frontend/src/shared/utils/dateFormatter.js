export const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '—';
export const formatDateTime = (date) => date ? new Date(date).toLocaleString() : '—';
