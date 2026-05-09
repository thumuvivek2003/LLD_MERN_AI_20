import { useState } from 'react';
import Modal from '../../../shared/components/ui/Modal.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import { addBook } from '../services/bookService.js';

export default function AddBookModal({ isOpen, onClose, onAdded }) {
  const [form, setForm] = useState({ title: '', author: '', isbn: '', totalCopies: 1 });
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBook(form);
    onAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Book">
      <form onSubmit={handleSubmit}>
        <Input label="Title" name="title" value={form.title} onChange={set} />
        <Input label="Author" name="author" value={form.author} onChange={set} />
        <Input label="ISBN" name="isbn" value={form.isbn} onChange={set} />
        <Input label="Total Copies" name="totalCopies" type="number" value={form.totalCopies} onChange={set} />
        <Button type="submit">Add Book</Button>
      </form>
    </Modal>
  );
}
