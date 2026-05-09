import Modal from '../../../shared/components/ui/Modal.jsx';
import Button from '../../../shared/components/ui/Button.jsx';

export default function ApproveRequestModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Request">
      <p>Are you sure you want to approve this borrow request?</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Button onClick={onConfirm} variant="success">Approve</Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
}
