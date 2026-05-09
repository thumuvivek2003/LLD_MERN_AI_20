import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingSummary from './components/BookingSummary.jsx';
import UpiPayment from '../payments/components/UpiPayment.jsx';
import CardPayment from '../payments/components/CardPayment.jsx';
import WalletPayment from '../payments/components/WalletPayment.jsx';
import { useBookingStore } from './booking.store.js';
import { usePayment } from '../payments/usePayment.js';
import { useBooking } from './useBooking.js';

const tabs = ['upi', 'card', 'wallet'];

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState('upi');
  const { selectedShow, selectedSeats } = useBookingStore();
  const { loading, error, processPayment } = usePayment();
  const { confirmBooking } = useBooking();
  const navigate = useNavigate();

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (!selectedShow) {
    navigate('/');
    return null;
  }

  const handlePay = async (details) => {
    await processPayment({
      method: activeTab,
      details,
      amount: total,
      onSuccess: () => confirmBooking(),
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Payment</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid #2a2a3e' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#0f0f1a', borderRadius: 8, padding: 4 }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', background: activeTab === tab ? '#e50914' : 'transparent', color: activeTab === tab ? '#fff' : '#a0a0b0' }}>
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'upi' && <UpiPayment amount={total} onPay={handlePay} loading={loading} />}
          {activeTab === 'card' && <CardPayment amount={total} onPay={handlePay} loading={loading} />}
          {activeTab === 'wallet' && <WalletPayment amount={total} onPay={handlePay} loading={loading} />}
          {error && <p style={{ color: '#e50914', fontSize: 13, marginTop: 12 }}>{error}</p>}
        </div>
        <BookingSummary show={selectedShow} seats={selectedSeats} />
      </div>
    </div>
  );
}
