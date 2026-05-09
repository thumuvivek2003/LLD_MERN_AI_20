export const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
export const formatTime = (time) => time;
export const formatDateTime = (date) => new Date(date).toLocaleString('en-IN');
