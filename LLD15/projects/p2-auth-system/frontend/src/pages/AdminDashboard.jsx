import React from "react";
import UserTable from "../components/UserTable";
import useAuth from "../hooks/useAuth";

const AdminDashboard = () => {
    const { user, logoutUser } = useAuth();
    return (
        <main className="page-content">
            <div className="dashboard-topbar">
                <div>
                    <p className="page-header__eyebrow">Admin Panel</p>
                    <h1 className="page-header__title">Dashboard</h1>
                </div>
                <div className="dashboard-user">
                    <div className="dashboard-user__info">
                        <span className="dashboard-user__name">{user?.name}</span>
                        <span className="role-badge role-badge--admin">{user?.role}</span>
                    </div>
                    <button className="btn btn--ghost" onClick={logoutUser}>
                        Logout
                    </button>
                </div>
            </div>

            <UserTable />
        </main>
    );
};

export default AdminDashboard;