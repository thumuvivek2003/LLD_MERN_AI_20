function VisibilitySelector({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="private">Private</option>
      <option value="public">Public</option>
      <option value="shared">Shared</option>
    </select>
  );
}

export default VisibilitySelector;