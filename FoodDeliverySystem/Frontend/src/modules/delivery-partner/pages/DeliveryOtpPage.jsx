import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/delivery.api.js';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { showSuccessToast, showErrorToast } from '../../../core/services/notification.service.js';

export const DeliveryOtpPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (otp.length !== 4) return showErrorToast('Enter 4-digit OTP');
    setLoading(true);
    try {
      await api.verifyDeliveryOtp(id, otp);
      showSuccessToast('Delivered!');
      navigate('/delivery/history');
    } catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6 text-center">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
        <p className="text-gray-500 text-sm mb-6">Ask the customer for the 4-digit OTP shown in their app</p>
        <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
          className="text-center text-2xl tracking-widest font-bold" placeholder="••••" />
        <Button onClick={submit} disabled={loading} className="w-full mt-2">
          {loading ? 'Verifying…' : 'Mark as Delivered'}
        </Button>
      </div>
    </div>
  );
};
