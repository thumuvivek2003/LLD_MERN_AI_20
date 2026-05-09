const variants = {
  AVAILABLE:  'bg-green-100 text-green-800',
  BORROWED:   'bg-blue-100 text-blue-800',
  RESERVED:   'bg-yellow-100 text-yellow-800',
  ACTIVE:     'bg-blue-100 text-blue-800',
  OVERDUE:    'bg-red-100 text-red-800',
  RETURNED:   'bg-gray-100 text-gray-800',
  PENDING:    'bg-yellow-100 text-yellow-800',
  COMPLETED:  'bg-green-100 text-green-800',
  EXPIRED:    'bg-gray-100 text-gray-500',
  CANCELLED:  'bg-gray-100 text-gray-500',
  PAID:       'bg-green-100 text-green-800',
  admin:      'bg-purple-100 text-purple-800',
  user:       'bg-blue-100 text-blue-800',
};

const Badge = ({ label, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[label] || 'bg-gray-100 text-gray-600'} ${className}`}>
    {label}
  </span>
);

export default Badge;
