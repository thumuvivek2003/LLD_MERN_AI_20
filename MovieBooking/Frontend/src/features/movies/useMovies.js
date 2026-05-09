import { useState, useEffect } from 'react';
import * as movieApi from './movie.api.js';
import { useDebounce } from '../../shared/hooks/useDebounce.js';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setLoading(true);
    movieApi.getMovies(debouncedSearch ? { search: debouncedSearch } : {})
      .then(res => setMovies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  return { movies, loading, search, setSearch };
};

export const useMovieDetail = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    Promise.all([movieApi.getMovie(movieId), movieApi.getMovieShows(movieId)])
      .then(([mRes, sRes]) => { setMovie(mRes.data); setShows(sRes.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  return { movie, shows, loading };
};
