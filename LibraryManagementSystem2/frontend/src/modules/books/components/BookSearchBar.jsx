import Input from '../../../shared/components/ui/Input.jsx';

export default function BookSearchBar({ value, onChange }) {
  return (
    <Input
      name="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by title or author..."
    />
  );
}
