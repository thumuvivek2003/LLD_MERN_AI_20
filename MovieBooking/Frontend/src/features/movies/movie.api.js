import api from '../../shared/api/axios.js';
import { ENDPOINTS } from '../../shared/api/apiEndpoints.js';

export const getMovies = (params) => api.get(ENDPOINTS.movies.list, { params });
export const getMovie = (id) => api.get(ENDPOINTS.movies.detail(id));
export const getMovieShows = (id) => api.get(ENDPOINTS.movies.shows(id));
