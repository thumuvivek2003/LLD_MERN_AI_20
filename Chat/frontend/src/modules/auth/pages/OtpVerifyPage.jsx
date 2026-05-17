import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginCard } from '../components/LoginCard.jsx';
import { OtpInput } from '../components/OtpInput.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function OtpVerifyPage() {
  const { pendingMobile, verify } = useAuth();
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [otp]);

  if (!pendingMobile) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await verify({ mobile: pendingMobile, otp, name: name.trim() || undefined });
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginCard
      title="Verify OTP"
      subtitle={`Code sent to +91 ${pendingMobile}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mb-1 text-sm text-wa-muted">One-time code</div>
          <OtpInput value={otp} onChange={setOtp} />
          <div className="mt-1 text-xs text-wa-muted">
            Dev hint: try <span className="font-mono">123456</span>
          </div>
        </div>
        <Input
          label="Your name (only required for new accounts)"
          placeholder="e.g. Vivek"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <div className="text-xs text-red-500">{error}</div> : null}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </form>
    </LoginCard>
  );
}
