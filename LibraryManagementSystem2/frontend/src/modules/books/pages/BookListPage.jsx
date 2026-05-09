import BookCard from '../components/BookCard.jsx';
import BookSearchBar from '../components/BookSearchBar.jsx';
import Loader from '../../../shared/components/ui/Loader.jsx';
import { useBooks } from '../hooks/useBooks.js';
import { useBookFilters } from '../hooks/useBookFilters.js';

export default function BookListPage() {
  const { search, setSearch, debouncedSearch } = useBookFilters();
  const { books, loading } = useBooks(debouncedSearch);

  return (
    <div className="page-container">
      <h1 className="page-title">Books</h1>
      <BookSearchBar value={search} onChange={setSearch} />
      {loading ? <Loader /> : books.map((b) => <BookCard key={b._id} book={b} />)}
    </div>
  );
}
