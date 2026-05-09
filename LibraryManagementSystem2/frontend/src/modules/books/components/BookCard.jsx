import { Link } from 'react-router-dom';
import Badge from '../../../shared/components/ui/Badge.jsx';
import { isAvailable, formatCopies } from '../utils/bookUtils.js';

export default function BookCard({ book }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p style={{ fontSize: '0.8rem', color: '#666' }}>{formatCopies(book)}</p>
      <Badge
        label={isAvailable(book) ? 'Available' : 'Unavailable'}
        variant={isAvailable(book) ? 'success' : 'danger'}
      />
      <Link to={`/books/${book._id}`} style={{ marginLeft: '0.5rem' }}>View</Link>
    </div>
  );
}
