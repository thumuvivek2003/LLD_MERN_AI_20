import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Marks from './pages/Marks';
import Attendance from './pages/Attendance';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MyMarks from "./pages/student/MyMarks";
import MyAttendance from "./pages/student/MyAttendance";

import './styles/app.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const handleLogin = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('role', userRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
    localStorage.clear();
  };

  const rolePermissions = {
    Admin: ["students", "courses", "marks", "attendance"],
    Teacher: ["marks", "attendance"],
    Student: ["my-marks", "my-attendance"]
  };

  const ProtectedRoute = ({ children, route }) => {
    if (!rolePermissions[role]?.includes(route)) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>

      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="flex h-screen bg-gray-100">
          <Sidebar role={role} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar onLogout={handleLogout} role={role} />


            <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
              <Routes>

                <Route path="/" element={<Dashboard role={role} />} />
                <Route path="/dashboard" element={<Dashboard role={role} />} />

                <Route
                  path="/students"
                  element={
                    <ProtectedRoute route="students">
                      <Students />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute route="courses">
                      <Courses />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/marks"
                  element={
                    <ProtectedRoute route="marks">
                      <Marks />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/attendance"
                  element={
                    <ProtectedRoute route="attendance">
                      <Attendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-marks"
                  element={
                    <ProtectedRoute route="my-marks">
                      <MyMarks />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-attendance"
                  element={
                    <ProtectedRoute route="my-attendance">
                      <MyAttendance />
                    </ProtectedRoute>
                  }
                />


                <Route path="*" element={<Navigate to="/dashboard" />} />

              </Routes>
            </main>
          </div>
        </div>
      )}

    </BrowserRouter>
  );
}

export default App;
