import { useEffect, useState } from 'react';
import Button from '../../shared/components/Button.jsx';
import { adminAuctionApi } from '../services/adminAuction.api.js';

export default function BidderAssignmentPanel({ auction, onAssigned }) {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(auction?.eligibleUserIds || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminAuctionApi.getMembers().then((d) => setMembers(d.users || [])).catch(() => {});
  }, []);

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  }

  async function save() {
    setSaving(true);
    try {
      await adminAuctionApi.assignBidders(auction.id, selected);
      onAssigned?.(selected);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">Eligible bidders</h3>
          <p className="text-xs text-slate-500">{selected.length} selected</p>
        </div>
        <Button onClick={save} loading={saving}>
          Save changes
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {members.map((m) => (
          <label
            key={m.id}
            className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 cursor-pointer hover:border-brand-300"
          >
            <input
              type="checkbox"
              checked={selected.includes(m.id)}
              onChange={() => toggle(m.id)}
            />
            <span className="text-sm">
              <span className="font-medium text-slate-800">{m.name}</span>
              <span className="block text-xs text-slate-400">{m.email}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
