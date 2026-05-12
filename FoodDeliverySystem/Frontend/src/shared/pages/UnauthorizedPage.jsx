import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
    <div className="text-7xl mb-3">🚫</div>
    <h1 className="text-3xl font-bold mb-2">Access denied</h1>
    <p className="text-gray-500 mb-6">You don’t have permission to view this page.</p>
    <Link to="/" className="btn-primary">Go home</Link>
  </div>
);
