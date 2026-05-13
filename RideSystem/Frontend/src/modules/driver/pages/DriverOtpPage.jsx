import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Input from '../../../core/components/ui/Input.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { driverApi } from '../services/driver.api.js';
import { toast } from '../../../core/utils/toast.util.js';

export default function DriverOtpPage() {
  const { rideId } = useParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await driverApi.verifyOtp(rideId, otp);
      toast.success('OTP verified', 'Trip started');
      navigate(`/driver/ride/${rideId}`);
    } catch (err) {
      toast.error('Invalid OTP', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center py-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 grid place-items-center text-3xl">🔒</div>
          <p className="font-semibold mt-3">Verify OTP</p>
          <p className="text-xs text-slate-500 mt-1">Ask the rider for the trip OTP to start the ride</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Input label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Verifying...' : 'Start trip'}</Button>
        </form>
      </Card>
    </div>
  );
}
