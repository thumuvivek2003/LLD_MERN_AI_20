import { useState, useEffect } from 'react';
import Modal from '../../../shared/components/ui/Modal.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import { editBook } from '../services/bookService.js';

export default function EditBookModal({ isOpen, onClose, book, onUpdated }) {
  const [form, setForm] = useState({});
  useEffect(() => { if (book) setForm(book); }, [book]);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editBook(book._id, form);
    onUpdated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Book">
      <form onSubmit={handleSubmit}>
        <Input label="Title" name="title" value={form.title || ''} onChange={set} />
        <Input label="Author" name="author" value={form.author || ''} onChange={set} />
        <Input label="Total Copies" name="totalCopies" type="number" value={form.totalCopies || ''} onChange={set} />
        <Button type="submit">Save</Button>
      </form>
    </Modal>
  );
}
