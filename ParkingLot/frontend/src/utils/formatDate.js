export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};
