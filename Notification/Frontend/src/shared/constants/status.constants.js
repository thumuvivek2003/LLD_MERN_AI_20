// Status dictionary — adding a new status is a one-line change.
export const NOTIFICATION_STATUS = {
  QUEUED: 'QUEUED',
  SENDING: 'SENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  RETRYING: 'RETRYING',
  DEAD: 'DEAD',
};

export const STATUS_META = {
  QUEUED: {
    label: 'Queued',
    pillClass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dotClass: 'bg-amber-400',
  },
  SENDING: {
    label: 'Sending',
    pillClass: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    dotClass: 'bg-slate-400',
  },
  SENT: {
    label: 'Sent',
    pillClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  FAILED: {
    label: 'Failed',
    pillClass: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dotClass: 'bg-red-500',
  },
  RETRYING: {
    label: 'Retrying',
    pillClass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dotClass: 'bg-amber-500 animate-pulse',
  },
  DEAD: {
    label: 'Dead',
    pillClass: 'bg-red-100 text-red-900 ring-1 ring-red-300',
    dotClass: 'bg-red-800',
  },
};
