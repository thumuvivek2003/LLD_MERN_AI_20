import { useState } from 'react';
import Input from '../../../shared/components/Input.jsx';
import Button from '../../../shared/components/Button.jsx';

export default function UpiPayment({ amount, onPay, loading }) {
  const [upiId, setUpiId] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="UPI ID" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" />
      <Button fullWidth onClick={() => onPay({ upiId })} disabled={!upiId || loading}>
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </Button>
    </div>
  );
}
