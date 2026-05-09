import Button from '../../../shared/components/Button.jsx';

export default function WalletPayment({ amount, onPay, loading }) {
  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>👛</div>
      <p style={{ color: '#a0a0b0', marginBottom: 20 }}>Pay using CineBook Wallet</p>
      <Button fullWidth onClick={() => onPay({})} disabled={loading}>
        {loading ? 'Processing...' : `Pay ₹${amount} from Wallet`}
      </Button>
    </div>
  );
}
