import React from 'react';

function CourseCard({ course, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
        <p className="text-gray-600 text-sm">Code: {course.code}</p>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-gray-700">
          <span className="font-semibold">Instructor:</span> {course.instructor}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Credits:</span> {course.credits}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Duration:</span> {course.duration}
        </p>
        <p className="text-gray-600 text-sm mt-3">{course.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(course)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CourseCard;