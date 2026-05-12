import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../../shared/components/forms/RegisterForm.jsx';
import { useAuthContext } from '../../../core/context/AuthContext.jsx';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const RegisterPage = () => {
  const { register, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      const user = await register(payload);
      showSuccessToast(`Welcome, ${user.name}`);
      navigate('/');
    } catch (e) { showErrorToast(e.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-gray-500 mb-4 text-sm">Join Foodie in seconds</p>
        <RegisterForm onSubmit={handleSubmit} loading={loading} />
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-brand font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
