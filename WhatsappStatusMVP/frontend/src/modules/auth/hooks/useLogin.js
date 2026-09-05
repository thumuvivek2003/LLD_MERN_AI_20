// modules/auth/hooks/useLogin.js — UI logic for the login screen.
import { useEffect, useState } from 'react';
import { authApi } from '../services/auth.api.js';
import { useAuth } from '../context/AuthProvider.jsx';

export function useLogin() {
  const { login } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    authApi
      .listUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const chooseUser = (user) => {
    setSelectedId(user.id);
    login(user); // no server round-trip required; selection IS the login
  };

  return { users, loading, error, selectedId, chooseUser };
}
