import React, { useEffect, useState } from "react";
import {
    getUsers,
    deleteUser,
    createUser,
    updateUser
} from "../services/userService";

import UserForm from "./UserForm";

const UserTable = () => {

    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    const handleAdd = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleSubmit = async (form) => {

        if (editingUser) {
            await updateUser(editingUser._id, form);
        } else {
            await createUser(form);
        }

        setShowForm(false);
        fetchUsers();
    };

    return (
        <div className="user-management">
            <div className="user-management__toolbar">
                <div className="section-header" style={{ marginBottom: 0, flex: 1 }}>
                    <span className="section-header__title">All Users</span>
                    <span className="section-header__line" />
                    <span className="section-header__count">{users.length}</span>
                </div>
                <button className="btn btn--primary" onClick={handleAdd}>
                    + Add User
                </button>
            </div>

            {showForm && (
                <UserForm
                    user={editingUser}
                    onSubmit={handleSubmit}
                    onClose={() => setShowForm(false)}
                />
            )}

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <span className="table-avatar">{user.name?.[0]?.toUpperCase()}</span>
                                    {user.name}
                                </td>
                                <td className="table-secondary">{user.email}</td>
                                <td>
                                    <span className={`role-badge role-badge--${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn btn--ghost btn--sm"
                                            onClick={() => handleEdit(user)}
                                            title="Edit user"
                                        >
                                            ✏ Edit
                                        </button>
                                        <button
                                            className="btn btn--danger btn--sm"
                                            onClick={() => handleDelete(user._id)}
                                            title="Delete user"
                                        >
                                            ✕ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;