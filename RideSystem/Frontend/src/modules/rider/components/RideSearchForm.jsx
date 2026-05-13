import { useState } from 'react';
import Input from '../../../core/components/ui/Input.jsx';
import Button from '../../../core/components/ui/Button.jsx';

export default function RideSearchForm({ onSubmit, loading }) {
  const [pickup, setPickup] = useState({ address: 'Home', lat: 28.6139, lng: 77.2090 });
  const [drop, setDrop] = useState({ address: 'Office', lat: 28.5355, lng: 77.3910 });

  const update = (setter, field) => (e) =>
    setter((s) => ({ ...s, [field]: field === 'address' ? e.target.value : Number(e.target.value) }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ pickup, drop });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <Input label="Pickup address" value={pickup.address} onChange={update(setPickup, 'address')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Pickup lat" type="number" step="any" value={pickup.lat} onChange={update(setPickup, 'lat')} />
          <Input label="Pickup lng" type="number" step="any" value={pickup.lng} onChange={update(setPickup, 'lng')} />
        </div>
        <Input label="Drop address" value={drop.address} onChange={update(setDrop, 'address')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Drop lat" type="number" step="any" value={drop.lat} onChange={update(setDrop, 'lat')} />
          <Input label="Drop lng" type="number" step="any" value={drop.lng} onChange={update(setDrop, 'lng')} />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Finding...' : 'Find Drivers'}</Button>
    </form>
  );
}
