import { useState } from 'react';
import { useDebounce } from '../../../shared/hooks/useDebounce.js';

export function useBookFilters() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  return { search, setSearch, debouncedSearch };
}
