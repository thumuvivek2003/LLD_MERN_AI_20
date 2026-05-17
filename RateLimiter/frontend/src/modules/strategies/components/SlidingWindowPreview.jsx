export function SlidingWindowPreview() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-20">
      <line x1="0" y1="32" x2="200" y2="32" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="40" y="18" width="80" height="28" rx="6" fill="#ede9fe" stroke="#8b5cf6" />
      <circle cx="20" cy="32" r="3" fill="#94a3b8" />
      <circle cx="55" cy="32" r="3" fill="#7c3aed" />
      <circle cx="80" cy="32" r="3" fill="#7c3aed" />
      <circle cx="105" cy="32" r="3" fill="#7c3aed" />
      <circle cx="140" cy="32" r="3" fill="#94a3b8" />
      <path d="M150 26 L160 32 L150 38 Z" fill="#7c3aed" />
    </svg>
  );
}

export default SlidingWindowPreview;
