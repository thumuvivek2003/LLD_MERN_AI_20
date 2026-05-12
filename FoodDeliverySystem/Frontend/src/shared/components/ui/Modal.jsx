export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t bg-gray-50 flex gap-2 justify-end rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
};
