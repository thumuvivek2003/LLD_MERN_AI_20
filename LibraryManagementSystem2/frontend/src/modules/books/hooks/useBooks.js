import { useState, useEffect, useCallback } from 'react';
import { getBooks } from '../services/bookService.js';

export function useBooks(query = '') {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(() => {
    setLoading(true);
    getBooks(query)
      .then(({ data }) => setBooks(data.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => { fetch(); }, [fetch]);

  return { books, loading, error, refetch: fetch };
}
