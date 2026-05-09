import { useState, useEffect } from 'react';
import ShowTable from './components/ShowTable.jsx';
import Modal from '../../shared/components/Modal.jsx';
import Button from '../../shared/components/Button.jsx';
import Input from '../../shared/components/Input.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useModal } from '../../shared/hooks/useModal.js';
import * as adminApi from './admin.api.js';

const emptyForm = { movieId: '', screenId: '', theaterId: '', date: '', startTime: '', basePrice: '' };

export default function ShowsPage() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { isOpen, data: editShow, open, close } = useModal();

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getShows(), adminApi.getMovies(), adminApi.getTheaters()])
      .then(([s, m, t]) => { setShows(s.data); setMovies(m.data); setTheaters(t.data); })
      .finally(() => setLoading(false));
  };

  const loadScreens = (theaterId) => {
    if (!theaterId) return;
    adminApi.getScreensByTheater(theaterId).then(res => setScreens(res.data));
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    if (k === 'theaterId') loadScreens(val);
  };

  const handleEdit = (show) => {
    setForm({ movieId: show.movieId?._id, screenId: show.screenId?._id, theaterId: show.theaterId?._id, date: show.date?.split('T')[0], startTime: show.startTime, basePrice: show.basePrice });
    loadScreens(show.theaterId?._id);
    open(show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, basePrice: +form.basePrice };
    if (editShow) await adminApi.updateShow(editShow._id, payload);
    else await adminApi.createShow(payload);
    close(); setForm(emptyForm); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this show?')) return;
    await adminApi.deleteShow(id); load();
  };

  if (loading) return <Loader />;

  const selectStyle = { background: '#0f0f1a', border: '1px solid #2a2a3e', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: '100%' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Shows</h1>
        <Button onClick={() => { setForm(emptyForm); open(null); }}>+ Create Show</Button>
      </div>
      <div style={{ background: '#1a1a2e', borderRadius: 12, border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        <ShowTable shows={shows} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Modal isOpen={isOpen} onClose={close} title={editShow ? 'Edit Show' : 'Create Show'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={{ fontSize: 13, color: '#a0a0b0', fontWeight: 500, display: 'block', marginBottom: 6 }}>Movie</label>
            <select style={selectStyle} value={form.movieId} onChange={set('movieId')} required>
              <option value="">Select movie</option>
              {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
            </select>
          </div>
          <div><label style={{ fontSize: 13, color: '#a0a0b0', fontWeight: 500, display: 'block', marginBottom: 6 }}>Theater</label>
            <select style={selectStyle} value={form.theaterId} onChange={set('theaterId')} required>
              <option value="">Select theater</option>
              {theaters.map(t => <option key={t._id} value={t._id}>{t.name} - {t.city}</option>)}
            </select>
          </div>
          <div><label style={{ fontSize: 13, color: '#a0a0b0', fontWeight: 500, display: 'block', marginBottom: 6 }}>Screen</label>
            <select style={selectStyle} value={form.screenId} onChange={set('screenId')} required>
              <option value="">Select screen</option>
              {screens.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <Input label="Date" type="date" value={form.date} onChange={set('date')} required />
          <Input label="Start Time" type="time" value={form.startTime} onChange={set('startTime')} required />
          <Input label="Base Price (₹)" type="number" value={form.basePrice} onChange={set('basePrice')} required />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={close} type="button">Cancel</Button>
            <Button type="submit">{editShow ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
