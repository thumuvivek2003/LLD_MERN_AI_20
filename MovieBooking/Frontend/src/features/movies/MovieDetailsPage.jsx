import { useParams } from 'react-router-dom';
import MovieBanner from './components/MovieBanner.jsx';
import TheaterList from './components/TheaterList.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useMovieDetail } from './useMovies.js';

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const { movie, shows, loading } = useMovieDetail(movieId);

  if (loading) return <Loader />;
  if (!movie) return <div style={{ textAlign: 'center', padding: 40, color: '#a0a0b0' }}>Movie not found</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 0' }}>
      <MovieBanner movie={movie} />
      {movie.description && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>About</h2>
          <p style={{ color: '#a0a0b0', lineHeight: 1.7 }}>{movie.description}</p>
        </div>
      )}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Shows</h2>
      {shows.length === 0
        ? <p style={{ color: '#a0a0b0' }}>No shows available</p>
        : <TheaterList shows={shows} />
      }
    </div>
  );
}
