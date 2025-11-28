import React from 'react';

function Navbar({ onLogout, role }) {
  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          Student Management System
        </h1>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* Role Badge */}
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
            {role}
          </span>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
