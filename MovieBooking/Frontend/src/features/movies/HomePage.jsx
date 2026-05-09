import MovieCard from './components/MovieCard.jsx';
import SearchBar from '../../shared/components/SearchBar.jsx';
import Loader from '../../shared/components/Loader.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { useMovies } from './useMovies.js';

export default function HomePage() {
  const { movies, loading, search, setSearch } = useMovies();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Now Showing</h1>
        <SearchBar value={search} onChange={setSearch} placeholder="Search movies..." />
      </div>

      {loading ? <Loader /> : movies.length === 0 ? (
        <EmptyState title="No movies found" message="Try a different search" />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {movies.map(movie => <MovieCard key={movie._id} movie={movie} />)}
        </div>
      )}
    </div>
  );
}
