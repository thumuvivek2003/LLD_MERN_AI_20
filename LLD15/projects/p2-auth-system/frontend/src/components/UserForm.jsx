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
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal__header">
                    <div>
                        <p className="auth-form__eyebrow">{user ? "Editing user" : "New user"}</p>
                        <h3 className="modal__title">{user ? "Edit User" : "Add User"}</h3>
                    </div>
                    <button className="modal__close btn btn--ghost" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-label" htmlFor="uf-name">Full Name</label>
                        <input
                            id="uf-name"
                            className="form-input"
                            name="name"
                            type="text"
                            placeholder="Jane Doe"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="uf-email">Email</label>
                        <input
                            id="uf-email"
                            className="form-input"
                            name="email"
                            type="email"
                            placeholder="jane@example.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="uf-password">Password</label>
                        <input
                            id="uf-password"
                            className="form-input"
                            name="password"
                            type="password"
                            placeholder={user ? "Leave blank to keep current" : "Min. 8 characters"}
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="uf-role">Role</label>
                        <select
                            id="uf-role"
                            className="form-select"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="modal__actions">
                        <button type="button" className="btn btn--ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {user ? "Save Changes" : "Add User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;