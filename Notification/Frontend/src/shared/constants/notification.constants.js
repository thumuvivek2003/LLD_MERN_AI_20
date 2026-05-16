// Channel + event dictionaries — adding a new channel here makes it
// appear automatically in the channel selector, preview, status pills, etc.

export const CHANNEL_TYPES = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH',
};

export const CHANNELS = [
  {
    key: CHANNEL_TYPES.EMAIL,
    label: 'Email',
    icon: 'mail',
    description: 'Rich subject + body, best for receipts and confirmations.',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    key: CHANNEL_TYPES.SMS,
    label: 'SMS',
    icon: 'chat',
    description: 'Short, urgent transactional messages.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    key: CHANNEL_TYPES.PUSH,
    label: 'Push',
    icon: 'bell',
    description: 'Lightweight in-app / mobile push card.',
    color: 'bg-violet-50 text-violet-700 border-violet-100',
  },
];

export const EVENT_TYPES = [
  { key: 'ORDER_CREATED', label: 'Order Created' },
  { key: 'PAYMENT_SUCCESS', label: 'Payment Success' },
  { key: 'RIDE_COMPLETED', label: 'Ride Completed' },
  { key: 'RIDE_BOOKED', label: 'Ride Booked' },
  { key: 'CUSTOM', label: 'Custom' },
];

export const ACTOR_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SYSTEM: 'SYSTEM',
};
