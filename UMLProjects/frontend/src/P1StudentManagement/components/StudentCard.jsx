import React from 'react';

function StudentCard({ student, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
            {/* <p className="text-gray-600">ID: {student.id}</p> */}
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> {student.email}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Course:</span> {student.course}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Phone:</span> {student.phone}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(student)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(student.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default StudentCard;