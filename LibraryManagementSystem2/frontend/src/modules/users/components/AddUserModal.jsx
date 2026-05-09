import { useState } from 'react';
import Modal from '../../../shared/components/ui/Modal.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import RoleSelector from './RoleSelector.jsx';
import { addUser } from '../services/userService.js';

export default function AddUserModal({ isOpen, onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(form);
    onAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add User">
      <form onSubmit={handleSubmit}>
        <Input label="Name" name="name" value={form.name} onChange={set} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={set} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={set} />
        <RoleSelector value={form.role} onChange={(role) => setForm((f) => ({ ...f, role }))} />
        <Button type="submit">Add User</Button>
      </form>
    </Modal>
  );
}
