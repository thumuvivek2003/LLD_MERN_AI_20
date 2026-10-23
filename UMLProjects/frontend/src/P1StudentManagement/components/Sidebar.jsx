import { Link, useLocation } from 'react-router-dom';

function Sidebar({ role }) {
  const location = useLocation();

  const allMenuItems = {
    Admin: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/students', label: 'Students', icon: '👨‍🎓' },
      { path: '/courses', label: 'Courses', icon: '📚' },
      { path: '/marks', label: 'Marks', icon: '📝' },
      { path: '/attendance', label: 'Attendance', icon: '📅' }
    ],

    Teacher: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/marks', label: 'Marks', icon: '📝' },
      { path: '/attendance', label: 'Attendance', icon: '📅' }
    ],

    Student: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/my-marks', label: 'My Marks', icon: '📝' },
      { path: '/my-attendance', label: 'My Attendance', icon: '📅' }
    ]
  };

  const menuItems = allMenuItems[role] || [];

  return (
    <aside className="bg-indigo-900 text-white w-64 min-h-screen p-4">

      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold">Navigation</h2>
        <p className="text-sm text-indigo-300">{role} Panel</p>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? 'bg-indigo-700'
                    : 'hover:bg-indigo-800'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

    </aside>
  );
}

export default Sidebar;
