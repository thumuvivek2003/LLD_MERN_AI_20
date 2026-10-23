// pages/common/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Library Management System</h1>
          <p className="text-xl">Manage your library efficiently and effectively</p>
        </div>

        {!user ? (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">For Members</h2>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li>✓ Search and browse books</li>
                <li>✓ Reserve books online</li>
                <li>✓ Track borrow history</li>
                <li>✓ Check book availability</li>
              </ul>
              <Link to="/login" className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700">
                Login as Member
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">For Staff</h2>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li>✓ Issue and return books</li>
                <li>✓ Manage book inventory</li>
                <li>✓ Track all transactions</li>
                <li>✓ Generate reports</li>
              </ul>
              <Link to="/login" className="block w-full bg-green-600 text-white text-center py-3 rounded-md hover:bg-green-700">
                Staff Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome back, {user.name}!</h2>
            <p className="text-gray-600 mb-6">Choose an action below to get started</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {user.role === 'member' && (
                <>
                  <Link to="/member/search" className="bg-blue-600 text-white text-center py-4 rounded-md hover:bg-blue-700">
                    Search Books
                  </Link>
                  <Link to="/member/reservations" className="bg-green-600 text-white text-center py-4 rounded-md hover:bg-green-700">
                    My Reservations
                  </Link>
                  <Link to="/member/history" className="bg-purple-600 text-white text-center py-4 rounded-md hover:bg-purple-700">
                    Borrow History
                  </Link>
                </>
              )}
              
              {user.role === 'librarian' && (
                <>
                  <Link to="/librarian/issue" className="bg-blue-600 text-white text-center py-4 rounded-md hover:bg-blue-700">
                    Issue Book
                  </Link>
                  <Link to="/librarian/return" className="bg-green-600 text-white text-center py-4 rounded-md hover:bg-green-700">
                    Return Book
                  </Link>
                  <Link to="/librarian/history" className="bg-purple-600 text-white text-center py-4 rounded-md hover:bg-purple-700">
                    Borrow History
                  </Link>
                </>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="bg-blue-600 text-white text-center py-4 rounded-md hover:bg-blue-700">
                    Dashboard
                  </Link>
                  <Link to="/admin/manage-users" className="bg-green-600 text-white text-center py-4 rounded-md hover:bg-green-700">
                    Manage Users
                  </Link>
                  <Link to="/admin/reports" className="bg-purple-600 text-white text-center py-4 rounded-md hover:bg-purple-700">
                    Reports
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}