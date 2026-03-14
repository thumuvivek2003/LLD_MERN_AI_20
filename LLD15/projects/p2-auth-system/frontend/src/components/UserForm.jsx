import React, { useState, useEffect } from "react";

const UserForm = ({ user, onSubmit, onClose }) => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                password: "",
                role: user.role
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div>
            <h3>{user ? "Edit User" : "Add User"}</h3>

            <form onSubmit={handleSubmit}>

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <button type="submit">Save</button>

                <button type="button" onClick={onClose}>
                    Cancel
                </button>

            </form>
        </div>
    );
};

export default UserForm;