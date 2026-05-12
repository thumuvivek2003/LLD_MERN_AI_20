export const Input = ({ label, error, className = '', ...props }) => (
  <div className="mb-3">
    {label && <label className="label">{label}</label>}
    <input className={`input ${error ? 'border-red-400' : ''} ${className}`} {...props} />
    {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
  </div>
);

export const Select = ({ label, error, children, className = '', ...props }) => (
  <div className="mb-3">
    {label && <label className="label">{label}</label>}
    <select className={`input ${error ? 'border-red-400' : ''} ${className}`} {...props}>
      {children}
    </select>
    {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
  </div>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="mb-3">
    {label && <label className="label">{label}</label>}
    <textarea className={`input ${error ? 'border-red-400' : ''} ${className}`} rows={3} {...props} />
    {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
  </div>
);
