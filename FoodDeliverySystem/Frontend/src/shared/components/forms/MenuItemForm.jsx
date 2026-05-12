import { useState } from 'react';
import { Input, Textarea, Select } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';

export const MenuItemForm = ({ initial = {}, restaurantId, onSubmit, submitLabel = 'Save', loading }) => {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    price: initial.price ?? '',
    imageUrl: initial.imageUrl || '',
    category: initial.category || 'Main',
    isVeg: initial.isVeg ?? true,
    isAvailable: initial.isAvailable ?? true,
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      restaurantId,
      price: Number(form.price),
      isVeg: form.isVeg === true || form.isVeg === 'true',
      isAvailable: form.isAvailable === true || form.isAvailable === 'true',
    });
  };

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-x-4">
      <Input label="Name" value={form.name} onChange={set('name')} required />
      <Input label="Price" type="number" min="0" value={form.price} onChange={set('price')} required />
      <div className="sm:col-span-2">
        <Textarea label="Description" value={form.description} onChange={set('description')} />
      </div>
      <Input label="Image URL" value={form.imageUrl} onChange={set('imageUrl')} />
      <Input label="Category" value={form.category} onChange={set('category')} />
      <Select label="Type" value={form.isVeg ? 'true' : 'false'} onChange={(e) => setForm({ ...form, isVeg: e.target.value === 'true' })}>
        <option value="true">Veg</option>
        <option value="false">Non-Veg</option>
      </Select>
      <Select label="Availability" value={form.isAvailable ? 'true' : 'false'} onChange={(e) => setForm({ ...form, isAvailable: e.target.value === 'true' })}>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </Select>
      <div className="sm:col-span-2 mt-2">
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  );
};
