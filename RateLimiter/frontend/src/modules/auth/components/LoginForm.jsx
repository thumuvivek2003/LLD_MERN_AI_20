import { useState } from 'react';
import { Button } from '../../shared/components/Button.jsx';

function validate({ username, password }) {
  if (!username?.trim()) return 'Username is required';
  if (!password) return 'Password is required';
  return null;
}

export function LoginForm({ onSubmit, loading, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate({ username, password });
    if (v) {
      setLocalError(v);
      return;
    }
    setLocalError(null);
    onSubmit({ username: username.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Username</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin or mobile-app"
          autoFocus
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
      </div>
      {(localError || error) && (
        <div className="text-sm text-red-600">{localError || error}</div>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
    </form>
  );
}

export default LoginForm;
