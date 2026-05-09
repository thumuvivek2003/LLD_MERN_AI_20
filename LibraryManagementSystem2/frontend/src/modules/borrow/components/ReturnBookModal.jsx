import Modal from '../../../shared/components/ui/Modal.jsx';
import Button from '../../../shared/components/ui/Button.jsx';

export default function ReturnBookModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Return Book">
      <p>Confirm returning this book?</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Button onClick={onConfirm}>Confirm Return</Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
}
