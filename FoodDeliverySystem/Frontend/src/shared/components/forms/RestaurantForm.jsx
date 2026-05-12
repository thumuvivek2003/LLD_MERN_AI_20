import { useState } from 'react';
import { Input, Textarea } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';

export const RestaurantForm = ({ initial = {}, onSubmit, submitLabel = 'Save', loading }) => {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    address: initial.address || '',
    latitude: initial.latitude ?? '',
    longitude: initial.longitude ?? '',
    rating: initial.rating ?? 4.0,
    imageUrl: initial.imageUrl || '',
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      rating: Number(form.rating),
    });
  };

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-x-4">
      <Input label="Name" value={form.name} onChange={set('name')} required />
      <Input label="Image URL" value={form.imageUrl} onChange={set('imageUrl')} />
      <div className="sm:col-span-2">
        <Textarea label="Description" value={form.description} onChange={set('description')} />
      </div>
      <div className="sm:col-span-2">
        <Input label="Address" value={form.address} onChange={set('address')} required />
      </div>
      <Input label="Latitude" type="number" step="0.0001" value={form.latitude} onChange={set('latitude')} required />
      <Input label="Longitude" type="number" step="0.0001" value={form.longitude} onChange={set('longitude')} required />
      <Input label="Rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set('rating')} />
      <div className="sm:col-span-2 mt-2">
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  );
};
