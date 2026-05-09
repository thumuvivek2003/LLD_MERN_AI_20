const styles = {
  base: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, transition: 'all 0.2s', cursor: 'pointer', border: 'none' },
  primary: { background: '#e50914', color: '#fff' },
  secondary: { background: '#1a1a2e', color: '#fff', border: '1px solid #2a2a3e' },
  ghost: { background: 'transparent', color: '#e50914', border: '1px solid #e50914' },
  danger: { background: '#dc2626', color: '#fff' },
};

export default function Button({ children, variant = 'primary', onClick, disabled, fullWidth, style, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles.base, ...styles[variant], width: fullWidth ? '100%' : 'auto', opacity: disabled ? 0.6 : 1, ...style }}
    >
      {children}
    </button>
  );
}
