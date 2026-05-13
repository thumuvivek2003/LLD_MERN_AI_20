import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function PaymentSuccessModal({ open, amount, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Payment Successful"
      footer={<Button onClick={onClose}>Continue</Button>}>
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 grid place-items-center text-3xl">✓</div>
        <p className="mt-4 text-3xl font-bold">{formatCurrency(amount)}</p>
        <p className="text-slate-500 text-sm mt-1">Your trip is paid. Thanks for riding!</p>
      </div>
    </Modal>
  );
}
