import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Input from '../../../core/components/ui/Input.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { driverApi } from '../services/driver.api.js';
import { toast } from '../../../core/utils/toast.util.js';

export default function VehicleRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'SEDAN', model: '', numberPlate: '', color: '' });
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await driverApi.registerVehicle(form);
      toast.success('Vehicle registered', 'You can now accept rides');
      navigate('/driver');
    } catch (err) {
      toast.error('Could not register', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Vehicle Details</h2>
      <Card>
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="label">Vehicle type</span>
            <select name="type" value={form.type} onChange={update} className="input">
              <option value="BIKE">Bike</option>
              <option value="MINI">Mini</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
            </select>
          </label>
          <Input label="Model" name="model" value={form.model} onChange={update} required />
          <Input label="Number plate" name="numberPlate" value={form.numberPlate} onChange={update} required />
          <Input label="Color" name="color" value={form.color} onChange={update} />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save & continue'}</Button>
        </form>
      </Card>
    </div>
  );
}
