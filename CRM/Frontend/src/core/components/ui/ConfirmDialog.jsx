import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';
import Modal from './Modal.jsx';

const TONE_STYLES = {
  danger: { icon: 'bg-rose-50 text-rose-500', variant: 'danger' },
  warning: { icon: 'bg-amber-50 text-amber-500', variant: 'primary' },
  accent: { icon: 'bg-accent-soft text-accent', variant: 'primary' },
};

/**
 * Generic confirm modal. Also the body of the business "Archive (Soft Delete)" screen,
 * which passes a record preview through `children`.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  note,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  children,
}) {
  const style = TONE_STYLES[tone] || TONE_STYLES.danger;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={style.variant} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {note && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-amber-50/70 px-3 py-2.5 ring-1 ring-amber-100">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-xs leading-relaxed text-amber-800">{note}</p>
        </div>
      )}
    </Modal>
  );
}

export default ConfirmDialog;
