import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

export default function RideOtpModal({ open, otp, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Share OTP with your driver"
      footer={<Button onClick={onClose}>Done</Button>}>
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm">Your trip OTP</p>
        <div className="mt-4 inline-flex gap-2">
          {String(otp || '').split('').map((d, i) => (
            <span key={i} className="w-12 h-14 rounded-xl border-2 border-brand text-2xl font-bold grid place-items-center">{d}</span>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">Share this with the driver to start the trip.</p>
      </div>
    </Modal>
  );
}
