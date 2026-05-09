import Table from '../../../shared/components/ui/Table.jsx';
import Button from '../../../shared/components/ui/Button.jsx';

export default function BookTable({ books, onEdit, onDelete }) {
  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'availableCopies', label: 'Available' },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={() => onEdit(row)} variant="secondary">Edit</Button>
          <Button onClick={() => onDelete(row._id)} variant="danger">Delete</Button>
        </div>
      ),
    },
  ];
  return <Table columns={columns} data={books} />;
}
