export function TokenBucketPreview() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-20">
      <path d="M70 14 L130 14 L120 50 L80 50 Z" fill="#fef3c7" stroke="#f59e0b" />
      <circle cx="90" cy="28" r="3" fill="#f59e0b" />
      <circle cx="100" cy="34" r="3" fill="#f59e0b" />
      <circle cx="110" cy="28" r="3" fill="#f59e0b" />
      <path d="M40 6 L60 6 L60 14 L40 14 Z" fill="#fde68a" />
      <line x1="50" y1="14" x2="92" y2="20" stroke="#f59e0b" strokeDasharray="2 2" />
      <path d="M125 32 L150 32" stroke="#16a34a" strokeWidth="2" />
      <path d="M148 28 L154 32 L148 36 Z" fill="#16a34a" />
    </svg>
  );
}

export default TokenBucketPreview;
