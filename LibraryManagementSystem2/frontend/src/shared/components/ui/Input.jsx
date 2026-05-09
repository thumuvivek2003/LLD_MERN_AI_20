export default function Input({ label, name, value, onChange, type = 'text', placeholder, error }) {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
