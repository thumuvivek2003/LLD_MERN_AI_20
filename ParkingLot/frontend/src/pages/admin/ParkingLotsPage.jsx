import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parkingService } from '../../services/parking.service.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { useModal } from '../../hooks/useModal.js';

export const ParkingLotsPage = () => {
  const qc = useQueryClient();
  const modal = useModal();
  const [form, setForm] = useState({ name: '', address: '' });

  const { data: lots = [], isLoading } = useQuery({ queryKey: ['lots'], queryFn: parkingService.listLots });

  const create = useMutation({
    mutationFn: parkingService.createLot,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lots'] });
      modal.hide();
      setForm({ name: '', address: '' });
    },
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'address', label: 'Address' },
    { key: '_id', label: 'ID' },
  ];

  return (
    <PageContainer
      title="Parking Lots"
      subtitle="Manage parking facilities"
      action={<Button onClick={modal.show}>Add lot</Button>}
    >
      {isLoading ? <Loader /> : <Table columns={columns} rows={lots} empty="No lots yet" />}
      <Modal
        open={modal.open}
        onClose={modal.hide}
        title="Create parking lot"
        footer={
          <>
            <Button variant="secondary" onClick={modal.hide}>Cancel</Button>
            <Button onClick={() => create.mutate(form)} disabled={!form.name || create.isPending}>
              {create.isPending ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
      </Modal>
    </PageContainer>
  );
};
