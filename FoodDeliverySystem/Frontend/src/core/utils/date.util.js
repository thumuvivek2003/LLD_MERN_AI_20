export const formatDate = (input) => {
  if (!input) return '';
  const d = new Date(input);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};
