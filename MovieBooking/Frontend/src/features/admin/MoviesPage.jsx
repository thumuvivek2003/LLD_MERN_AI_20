import { useState, useEffect } from 'react';
import MovieTable from './components/MovieTable.jsx';
import Modal from '../../shared/components/Modal.jsx';
import Button from '../../shared/components/Button.jsx';
import Input from '../../shared/components/Input.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useModal } from '../../shared/hooks/useModal.js';
import * as adminApi from './admin.api.js';

const emptyForm = { title: '', description: '', duration: '', genre: '', language: 'English', rating: '', posterUrl: '', director: '' };

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { isOpen, data: editMovie, open, close } = useModal();

  const load = () => {
    setLoading(true);
    adminApi.getMovies().then(res => setMovies(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleEdit = (movie) => {
    setForm({ ...movie, genre: movie.genre?.join(', ') || '', duration: movie.duration?.toString() || '', rating: movie.rating?.toString() || '' });
    open(movie);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, genre: form.genre.split(',').map(g => g.trim()), duration: +form.duration, rating: +form.rating };
    if (editMovie) await adminApi.updateMovie(editMovie._id, payload);
    else await adminApi.createMovie(payload);
    close();
    setForm(emptyForm);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie?')) return;
    await adminApi.deleteMovie(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Movies</h1>
        <Button onClick={() => { setForm(emptyForm); open(null); }}>+ Add Movie</Button>
      </div>
      <div style={{ background: '#1a1a2e', borderRadius: 12, border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        <MovieTable movies={movies} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Modal isOpen={isOpen} onClose={close} title={editMovie ? 'Edit Movie' : 'Add Movie'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Title" value={form.title} onChange={set('title')} required />
          <Input label="Description" value={form.description} onChange={set('description')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Duration (min)" type="number" value={form.duration} onChange={set('duration')} required />
            <Input label="Rating (0-10)" type="number" value={form.rating} onChange={set('rating')} step="0.1" />
          </div>
          <Input label="Genre (comma-separated)" value={form.genre} onChange={set('genre')} placeholder="Action, Drama" />
          <Input label="Language" value={form.language} onChange={set('language')} />
          <Input label="Director" value={form.director} onChange={set('director')} />
          <Input label="Poster URL" value={form.posterUrl} onChange={set('posterUrl')} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={close} type="button">Cancel</Button>
            <Button type="submit">{editMovie ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
