import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import PaymentMethodCard from '../../../core/components/payment/PaymentMethodCard.jsx';
import PaymentSummary from '../../../core/components/payment/PaymentSummary.jsx';
import PaymentSuccessModal from '../../../core/components/payment/PaymentSuccessModal.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';
import { rideApi } from '../services/ride.api.js';
import { PAYMENT_METHOD, PAYMENT_METHOD_LABEL } from '../../../core/constants/payment.constants.js';
import { toast } from '../../../core/utils/toast.util.js';

export default function PaymentPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { ride } = useRideTracking(rideId);
  const [method, setMethod] = useState(PAYMENT_METHOD.UPI);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      await rideApi.pay(rideId, method);
      setSuccess(true);
    } catch (e) {
      toast.error('Payment failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <p className="font-semibold mb-3">Payment</p>
        <PaymentSummary ride={ride} />
      </Card>

      <div className="space-y-2">
        <p className="font-semibold text-sm">Choose payment method</p>
        <PaymentMethodCard method={PAYMENT_METHOD.UPI} icon="📱" label={PAYMENT_METHOD_LABEL.UPI} hint="Google Pay, PhonePe, Paytm"
          selected={method === PAYMENT_METHOD.UPI} onClick={() => setMethod(PAYMENT_METHOD.UPI)} />
        <PaymentMethodCard method={PAYMENT_METHOD.CARD} icon="💳" label={PAYMENT_METHOD_LABEL.CARD} hint="Visa, Mastercard, Rupay"
          selected={method === PAYMENT_METHOD.CARD} onClick={() => setMethod(PAYMENT_METHOD.CARD)} />
        <PaymentMethodCard method={PAYMENT_METHOD.CASH} icon="💵" label={PAYMENT_METHOD_LABEL.CASH} hint="Pay directly to driver"
          selected={method === PAYMENT_METHOD.CASH} onClick={() => setMethod(PAYMENT_METHOD.CASH)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" disabled={loading} onClick={() => {
          toast.info('Payment cancelled', 'You can pay later from your home screen');
          navigate('/rider');
        }}>
          Cancel
        </Button>
        <Button disabled={loading || !ride} onClick={pay}>
          {loading ? 'Processing...' : `Pay ₹${ride?.fare ?? '—'}`}
        </Button>
      </div>

      <PaymentSuccessModal open={success} amount={ride?.fare} onClose={() => navigate('/rider/history')} />
    </div>
  );
}
