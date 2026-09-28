const NUMBER = new Intl.NumberFormat('en-IN');
const COMPACT = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 2 });
const CURRENCY = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export const formatNumber = (value) =>
  value === null || value === undefined || value === '' ? '—' : NUMBER.format(Number(value));

export const formatCompact = (value) =>
  value === null || value === undefined || value === '' ? '—' : COMPACT.format(Number(value));

export const formatCurrency = (value) =>
  value === null || value === undefined || value === '' ? '—' : CURRENCY.format(Number(value));

export const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined || Number.isNaN(Number(bytes))) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let value = Number(bytes);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 100 || unit === 0 ? Math.round(value) : value.toFixed(2)} ${units[unit]}`;
};

export const formatPercent = (value, digits = 1) =>
  value === null || value === undefined || Number.isNaN(Number(value))
    ? '—'
    : `${Number(value).toFixed(digits)}%`;

const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  return `${formatDate(date)} ${date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export const formatTime = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const formatRelative = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const steps = [
    [60, 'min'],
    [24, 'hour'],
    [7, 'day'],
    [4.35, 'week'],
    [12, 'month'],
  ];
  let amount = seconds / 60;
  let unit = 'min';
  for (let i = 0; i < steps.length; i += 1) {
    const [divisor, nextUnit] = steps[i];
    if (i === 0) {
      unit = nextUnit;
      continue;
    }
    if (amount < divisor) break;
    amount /= divisor;
    unit = nextUnit;
  }
  const rounded = Math.floor(amount);
  return `${rounded} ${unit}${rounded === 1 ? '' : 's'} ago`;
};

export const formatDuration = (ms) => {
  if (ms === null || ms === undefined) return '—';
  const totalSeconds = Math.floor(Number(ms) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days) return `${days}d ${hours}h ${minutes}m`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/** "Ravi Kumar" → "RK", used by every avatar chip. */
export const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '—';

/** "Customer Name" → "customerName" — powers the auto-filled API Name inputs. */
export const toApiName = (label = '') => {
  const words = label
    .replace(/[^a-zA-Z0-9\s_-]/g, ' ')
    .split(/[\s_-]+/)
    .filter(Boolean);
  if (!words.length) return '';
  return words
    .map((word, i) =>
      i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
};

/** "Customer Name" → "customer-name" — object slugs. */
export const toSlug = (label = '') =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const pluralise = (label = '') => {
  if (!label) return '';
  if (/[^aeiou]y$/i.test(label)) return `${label.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/i.test(label)) return `${label}es`;
  return `${label}s`;
};

export const truncate = (text, max = 60) =>
  typeof text === 'string' && text.length > max ? `${text.slice(0, max - 1)}…` : text;
