import { useState } from 'react';
import Modal from '../../shared/components/Modal.jsx';
import Button from '../../shared/components/Button.jsx';
import { walletApi } from '../services/wallet.api.js';
import { showSuccessToast } from '../../shared/utils/toast.util.js';

const QUICK = [500, 1000, 5001, 10000];

export default function TopUpWalletModal({ open, onClose, onSuccess }) {
  const [amount, setAmount] = useState(1000);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await walletApi.topUp(Number(amount));
      showSuccessToast('Wallet topped up');
      onSuccess?.(data.balance);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Top up wallet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Amount</label>
          <input
            type="number"
            min="1"
            required
            className="input text-lg font-semibold"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(q)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs hover:bg-slate-100"
            >
              + {q}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Confirm top-up
          </Button>
        </div>
      </form>
    </Modal>
  );
}
