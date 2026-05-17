import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCard } from '../components/LoginCard.jsx';
import { MobileInput } from '../components/MobileInput.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function LoginPage() {
  const navigate = useNavigate();
  const { requestOtp } = useAuth();

  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [devOtp, setDevOtp] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (mobile.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const data = await requestOtp(mobile);
      setDevOtp(data?.otp || null);
      navigate(ROUTES.VERIFY);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginCard
      title="Login"
      subtitle="Enter your mobile number to receive a one-time code"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <MobileInput value={mobile} onChange={setMobile} error={error} />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Continue'}
        </Button>
        {devOtp ? (
          <div className="rounded bg-wa-light p-2 text-center text-xs text-wa-muted">
            Dev OTP: <span className="font-semibold">{devOtp}</span>
          </div>
        ) : null}
        <div className="text-center text-xs text-wa-muted">
          Admin: <span className="font-mono">9999999999</span>, OTP{' '}
          <span className="font-mono">123456</span>
        </div>
      </form>
    </LoginCard>
  );
}
