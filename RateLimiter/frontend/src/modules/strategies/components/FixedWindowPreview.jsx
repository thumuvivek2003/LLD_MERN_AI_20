export function FixedWindowPreview() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-20">
      <rect x="2" y="20" width="60" height="24" rx="4" fill="#e0e7ff" />
      <rect x="68" y="20" width="60" height="24" rx="4" fill="#c7d2fe" />
      <rect x="134" y="20" width="60" height="24" rx="4" fill="#a5b4fc" />
      <line x1="62" y1="14" x2="62" y2="50" stroke="#6366f1" strokeDasharray="2 2" />
      <line x1="128" y1="14" x2="128" y2="50" stroke="#6366f1" strokeDasharray="2 2" />
      <circle cx="20" cy="32" r="3" fill="#4f46e5" />
      <circle cx="35" cy="32" r="3" fill="#4f46e5" />
      <circle cx="80" cy="32" r="3" fill="#4f46e5" />
      <circle cx="150" cy="32" r="3" fill="#4f46e5" />
      <circle cx="170" cy="32" r="3" fill="#4f46e5" />
    </svg>
  );
}

export default FixedWindowPreview;
