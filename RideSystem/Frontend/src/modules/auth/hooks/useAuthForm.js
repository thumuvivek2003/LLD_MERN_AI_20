import { useState } from 'react';

export function useAuthForm(initial = {}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  return { values, setValues, onChange, error, setError, loading, setLoading };
}
