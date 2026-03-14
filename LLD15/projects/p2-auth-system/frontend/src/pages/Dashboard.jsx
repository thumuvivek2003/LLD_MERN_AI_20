import React from "react";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div>
      <h2>Welcome {user?.name}</h2>

      <button onClick={logoutUser}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;