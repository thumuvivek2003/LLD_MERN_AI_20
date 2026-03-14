import React from "react";
import UserTable from "../components/UserTable";
import useAuth from "../hooks/useAuth";

const AdminDashboard = () => {
    const {user,logoutUser} = useAuth();
    return (
        <div>
            <div>
                <h2>Welcome {user?.name} {user?.role}</h2>

                <button onClick={logoutUser}>
                    Logout
                </button>
            </div>
            <h1>Admin Dashboard</h1>
            <UserTable />
        </div>


    );
};

export default AdminDashboard;