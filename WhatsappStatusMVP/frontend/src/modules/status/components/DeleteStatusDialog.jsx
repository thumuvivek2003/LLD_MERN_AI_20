// modules/status/components/DeleteStatusDialog.jsx — Screen 12 confirm sheet.
import { BottomSheet } from '../../../core/components/BottomSheet.jsx';

export function DeleteStatusDialog({ open, onClose, onConfirm }) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pt-2 pb-6">
        <h3 className="text-base font-semibold">Delete status update?</h3>
        <p className="text-sm text-wa-muted mt-1">This status will be deleted for everyone.</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-full bg-red-500 text-white font-semibold hover:brightness-110 active:scale-[0.98] transition"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-wa-panel2 text-white font-semibold hover:bg-wa-line active:scale-[0.98] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
