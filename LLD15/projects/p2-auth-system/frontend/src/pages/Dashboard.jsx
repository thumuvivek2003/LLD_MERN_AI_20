import React from "react";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
    const { user, logoutUser } = useAuth();

    return (
        <main className="page-content">
            <div className="dashboard-topbar">
                <div>
                    <p className="page-header__eyebrow">My Space</p>
                    <h1 className="page-header__title">Welcome, {user?.name}</h1>
                </div>
                <button className="btn btn--ghost" onClick={logoutUser}>
                    Logout
                </button>
            </div>
        </main>
    );
};

export default Dashboard;