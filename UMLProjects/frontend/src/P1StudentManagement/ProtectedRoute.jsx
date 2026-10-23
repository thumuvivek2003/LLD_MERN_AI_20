import { Navigate } from "react-router-dom";

const rolePermissions = {
  Admin: ["students", "courses", "marks", "attendance"],
  Teacher: ["marks", "attendance"],
  Student: ["my-marks", "my-attendance"]
};

function ProtectedRoute({ children, role, route }) {
  const allowedRoutes = rolePermissions[role] || [];

  if (!allowedRoutes.includes(route)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
