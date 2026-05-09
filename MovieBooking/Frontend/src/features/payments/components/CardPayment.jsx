import { useState } from 'react';
import Input from '../../../shared/components/Input.jsx';
import Button from '../../../shared/components/Button.jsx';

export default function CardPayment({ amount, onPay, loading }) {
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const set = (k) => (e) => setCard(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Card Number" value={card.number} onChange={set('number')} placeholder="1234 5678 9012 3456" maxLength={19} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Expiry" value={card.expiry} onChange={set('expiry')} placeholder="MM/YY" />
        <Input label="CVV" value={card.cvv} onChange={set('cvv')} placeholder="123" maxLength={3} />
      </div>
      <Input label="Name on Card" value={card.name} onChange={set('name')} placeholder="John Doe" />
      <Button fullWidth onClick={() => onPay({ cardNumber: card.number })} disabled={!card.number || loading}>
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </Button>
    </div>
  );
}
