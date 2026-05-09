import { useState, useEffect } from 'react';
import TheaterTable from './components/TheaterTable.jsx';
import Modal from '../../shared/components/Modal.jsx';
import Button from '../../shared/components/Button.jsx';
import Input from '../../shared/components/Input.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useModal } from '../../shared/hooks/useModal.js';
import * as adminApi from './admin.api.js';

const emptyForm = { name: '', city: '', address: '' };

export default function TheatersPage() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { isOpen, data: editTheater, open, close } = useModal();

  const load = () => {
    setLoading(true);
    adminApi.getTheaters().then(res => setTheaters(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleEdit = (theater) => { setForm(theater); open(theater); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editTheater) await adminApi.updateTheater(editTheater._id, form);
    else await adminApi.createTheater(form);
    close(); setForm(emptyForm); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this theater?')) return;
    await adminApi.deleteTheater(id); load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Theaters</h1>
        <Button onClick={() => { setForm(emptyForm); open(null); }}>+ Add Theater</Button>
      </div>
      <div style={{ background: '#1a1a2e', borderRadius: 12, border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        <TheaterTable theaters={theaters} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Modal isOpen={isOpen} onClose={close} title={editTheater ? 'Edit Theater' : 'Add Theater'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Name" value={form.name} onChange={set('name')} required />
          <Input label="City" value={form.city} onChange={set('city')} required />
          <Input label="Address" value={form.address} onChange={set('address')} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={close} type="button">Cancel</Button>
            <Button type="submit">{editTheater ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
