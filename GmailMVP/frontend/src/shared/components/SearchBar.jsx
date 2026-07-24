import { useState } from 'react';
import { SearchIcon } from './Icons.jsx';

/**
 * Header search bar. Submits to the /search route via the provided handler.
 */
export default function SearchBar({ onSubmit, defaultValue = '', placeholder }) {
  const [value, setValue] = useState(defaultValue);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form
      onSubmit={submit}
      className="group flex w-full items-center gap-2 rounded-2xl bg-slate-100/80 px-4 py-2.5 transition-all focus-within:bg-white focus-within:shadow-sm focus-within:ring-2 focus-within:ring-brand-200"
    >
      <SearchIcon size={18} className="text-slate-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || 'Search mail'}
        className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
      />
    </form>
  );
}
