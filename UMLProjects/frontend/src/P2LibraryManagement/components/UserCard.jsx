// components/UserCard.jsx
function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
      <p className="text-gray-600 mb-2">Email: {user.email}</p>
      <p className="text-gray-600 mb-2">Role: {user.role}</p>
      <p className="text-gray-600 mb-4">Status: {user.active ? 'Active' : 'Inactive'}</p>
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(user)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;