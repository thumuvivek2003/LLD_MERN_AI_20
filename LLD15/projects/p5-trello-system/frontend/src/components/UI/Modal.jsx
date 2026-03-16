export default function Modal({ isOpen, onClose, children }) {

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    minWidth: "400px",
    maxWidth: "500px",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "8px",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
  },
};
