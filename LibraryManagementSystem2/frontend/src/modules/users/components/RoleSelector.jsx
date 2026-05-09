import { ROLES } from '../../../shared/constants/roles.js';

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="input-group">
      <label>Role</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.values(ROLES).map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
}
