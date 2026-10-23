import { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { LotListItem } from '../../features/parking-lot/components/LotListItem.jsx';
import {
  useParkingLots,
  useCreateParkingLot,
} from '../../features/parking-lot/hooks/useParkingLots.js';
import { useModal } from '../../hooks/useModal.js';
import { required } from '../../utils/validators.js';

export function ParkingLotsPage() {
  const lots = useParkingLots();
  const createLot = useCreateParkingLot();
  const modal = useModal();

  const [form, setForm] = useState({ name: '', address: '' });
  const [errors, setErrors] = useState({});
  const setField = (n) => (e) => setForm((p) => ({ ...p, [n]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!required(form.name)) {
      setErrors({ name: 'Name is required' });
      return;
    }
    setErrors({});
    createLot.mutate(form, {
      onSuccess: () => {
        modal.close();
        setForm({ name: '', address: '' });
      },
    });
  };

  const data = lots.data ?? [];
  const apiError = createLot.error?.response?.data?.message || createLot.error?.message;

  return (
    <PageContainer
      title="Parking Lots"
      subtitle="Configure your parking facilities"
      actions={<Button onClick={modal.open}>+ Add Parking Lot</Button>}
    >
      {lots.isLoading ? (
        <Loader label="Loading lots…" />
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <p className="text-sm text-ink-500">No parking lots yet.</p>
          <Button className="mt-4" onClick={modal.open}>
            Create your first lot
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((lot) => (
            <LotListItem key={lot._id || lot.id} lot={lot} />
          ))}
        </div>
      )}

      <Modal
        open={modal.isOpen}
        onClose={modal.close}
        title="Add Parking Lot"
        footer={
          <>
            <Button variant="secondary" onClick={modal.close}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={createLot.isPending}>
              {createLot.isPending ? 'Creating…' : 'Create lot'}
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={setField('name')}
            placeholder="Central Plaza"
            error={errors.name}
            autoFocus
          />
          <Input
            label="Address (optional)"
            value={form.address}
            onChange={setField('address')}
            placeholder="123 Main St"
          />
          {apiError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {apiError}
            </div>
          )}
        </form>
      </Modal>
    </PageContainer>
  );
}
