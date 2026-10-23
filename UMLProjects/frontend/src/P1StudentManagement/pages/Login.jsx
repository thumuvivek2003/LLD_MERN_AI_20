import { useState } from 'react';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: 'Student'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      alert("Please fill all fields");
      return;
    }

    // Save role to app
    onLogin(credentials.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Student Management System</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <select
            value={credentials.role}
            onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
            className="w-full border px-4 py-3 rounded-lg bg-white"
          >
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
