import Modal from '../../../core/components/ui/Modal.jsx';
import Button from '../../../core/components/ui/Button.jsx';

export default function UserBlockModal({ open, user, onConfirm, onClose }) {
  if (!user) return null;
  const willBlock = !user.isBlocked;
  return (
    <Modal open={open} onClose={onClose}
      title={willBlock ? 'Block user' : 'Unblock user'}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={willBlock ? 'danger' : 'primary'} onClick={onConfirm}>
          {willBlock ? 'Block' : 'Unblock'}
        </Button>
      </>}>
      <p className="text-sm text-slate-600">
        Are you sure you want to {willBlock ? 'block' : 'unblock'} <strong>{user.name}</strong> ({user.email})?
      </p>
    </Modal>
  );
}
