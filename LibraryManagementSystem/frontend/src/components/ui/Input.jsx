import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input ref={ref} className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`} {...props} />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
