import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { bookApi } from '../../api/bookApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const genres = ['Technology', 'Fiction', 'Non-Fiction', 'Self-Help', 'History', 'Science', 'Biography', 'Mystery', 'Romance', 'Other'];

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: bookData } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookApi.getBook(id).then((r) => r.data.data.book),
    enabled: isEdit,
  });

  useEffect(() => {
    if (bookData) reset(bookData);
  }, [bookData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? bookApi.updateBook(id, data) : bookApi.createBook(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Book updated!' : 'Book created!');
      navigate('/books');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed.'),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
        <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Update book information' : 'Add a new book to the library'}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Title" placeholder="Book title" error={errors.title?.message}
                {...register('title', { required: 'Title is required' })} />
            </div>
            <Input label="Author" placeholder="Author name" error={errors.author?.message}
              {...register('author', { required: 'Author is required' })} />
            <Input label="ISBN" placeholder="978-XXXXXXXXXX" error={errors.isbn?.message}
              {...register('isbn', { required: 'ISBN is required' })} />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <select className="input-field" {...register('genre', { required: 'Genre is required' })}>
                <option value="">Select genre</option>
                {genres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.genre && <p className="text-xs text-red-600">{errors.genre.message}</p>}
            </div>

            <Input label="Publisher" placeholder="Publisher name" {...register('publisher')} />
            <Input label="Published Year" type="number" placeholder="2024" {...register('publishedYear', { valueAsNumber: true })} />
            <Input label="Total Copies" type="number" min={1} placeholder="1" error={errors.totalCopies?.message}
              {...register('totalCopies', { required: 'Required', valueAsNumber: true, min: { value: 1, message: 'At least 1' } })} />
            <Input label="Cover Image URL" placeholder="https://..." {...register('coverImage')} />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Brief description of the book..."
              {...register('description')}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/books')}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Update Book' : 'Add Book'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditBook;
