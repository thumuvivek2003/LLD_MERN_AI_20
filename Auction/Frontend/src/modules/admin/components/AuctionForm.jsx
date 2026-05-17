import { useEffect, useState } from 'react';
import Button from '../../shared/components/Button.jsx';
import { INCREMENT_TYPE } from '../../shared/constants/socketEvents.constant.js';
import { adminAuctionApi } from '../services/adminAuction.api.js';

function toIso(local) {
  if (!local) return null;
  return new Date(local).toISOString();
}

export default function AuctionForm({ onSubmit, submitting }) {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    itemName: '',
    description: '',
    basePrice: 1000,
    imageUrl: '',
    startPrice: 1000,
    startTime: '',
    endTime: '',
    incrementType: INCREMENT_TYPE.FIXED,
    incrementValue: 100,
    eligibleUserIds: [],
  });

  useEffect(() => {
    adminAuctionApi
      .getMembers()
      .then((data) => setMembers(data.users || []))
      .catch(() => setMembers([]));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleUser(id) {
    setForm((prev) => ({
      ...prev,
      eligibleUserIds: prev.eligibleUserIds.includes(id)
        ? prev.eligibleUserIds.filter((u) => u !== id)
        : [...prev.eligibleUserIds, id],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      item: {
        name: form.itemName,
        description: form.description,
        basePrice: Number(form.basePrice),
        imageUrl: form.imageUrl || undefined,
      },
      startPrice: Number(form.startPrice),
      startTime: toIso(form.startTime),
      endTime: toIso(form.endTime),
      increment: {
        type: form.incrementType,
        value: Number(form.incrementValue),
      },
      eligibleUserIds: form.eligibleUserIds,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Item name</label>
            <input
              required
              className="input"
              value={form.itemName}
              onChange={(e) => update('itemName', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Base price</label>
            <input
              required
              type="number"
              min="0"
              className="input"
              value={form.basePrice}
              onChange={(e) => update('basePrice', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              rows={3}
              className="input"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Image URL (optional)</label>
            <input
              type="url"
              className="input"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Auction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Start price</label>
            <input
              required
              type="number"
              min="0"
              className="input"
              value={form.startPrice}
              onChange={(e) => update('startPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Increment type</label>
            <select
              className="input"
              value={form.incrementType}
              onChange={(e) => update('incrementType', e.target.value)}
            >
              <option value={INCREMENT_TYPE.FIXED}>Fixed</option>
              <option value={INCREMENT_TYPE.PERCENTAGE}>Percentage</option>
            </select>
          </div>
          <div>
            <label className="label">Increment value</label>
            <input
              required
              type="number"
              min="0"
              className="input"
              value={form.incrementValue}
              onChange={(e) => update('incrementValue', e.target.value)}
            />
          </div>
          <div />
          <div>
            <label className="label">Start time</label>
            <input
              required
              type="datetime-local"
              className="input"
              value={form.startTime}
              onChange={(e) => update('startTime', e.target.value)}
            />
          </div>
          <div>
            <label className="label">End time</label>
            <input
              required
              type="datetime-local"
              className="input"
              value={form.endTime}
              onChange={(e) => update('endTime', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-2">Eligible bidders</h3>
        <p className="text-xs text-slate-500 mb-3">
          Members ticked below will be allowed to place bids.
        </p>
        {members.length === 0 ? (
          <p className="text-sm text-slate-400">No members available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {members.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 cursor-pointer hover:border-brand-300"
              >
                <input
                  type="checkbox"
                  checked={form.eligibleUserIds.includes(m.id)}
                  onChange={() => toggleUser(m.id)}
                />
                <span className="text-sm">
                  <span className="font-medium text-slate-800">{m.name}</span>{' '}
                  <span className="text-slate-400 text-xs">{m.email}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          Create auction
        </Button>
      </div>
    </form>
  );
}
