import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';

export const ConfirmDialog = ({ isOpen, onCancel, onConfirm, title = 'Confirm', message = 'Are you sure?', confirmLabel = 'Confirm' }) => (
  <Modal
    isOpen={isOpen} onClose={onCancel} title={title}
    footer={<>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
    </>}
  >
    <p className="text-sm text-gray-600">{message}</p>
  </Modal>
);
