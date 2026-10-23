// components/BookCard.jsx
function BookCard({ book, onAction, actionLabel }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
      <p className="text-gray-600 mb-2">Author: {book.author}</p>
      <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
      <p className="text-gray-600 mb-4">
        Status: <span className={book.available ? 'text-green-600' : 'text-red-600'}>
          {book.available ? 'Available' : 'Unavailable'}
        </span>
      </p>
      {onAction && (
        <button
          onClick={() => onAction(book)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {actionLabel || 'Action'}
        </button>
      )}
    </div>
  );
}

export default BookCard;