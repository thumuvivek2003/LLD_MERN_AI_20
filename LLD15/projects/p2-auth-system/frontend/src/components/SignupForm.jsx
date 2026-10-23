import React, { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        // clear error while typing
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signup(form);

            alert("Signup successful");

            navigate("/login");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Signup failed. Please try again."
            );
        }
    };

    return (
        <div className="auth-form">
            <div className="auth-form__header">
                <p className="auth-form__eyebrow">Get started free</p>
                <h2 className="auth-form__title">Create your account</h2>
            </div>

            {error && (
                <div className="form-error">
                    <span className="form-error__icon">⚠</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label className="form-label" htmlFor="signup-name">Full Name</label>
                    <input
                        id="signup-name"
                        className="form-input"
                        name="name"
                        type="text"
                        placeholder="Jane Doe"
                        value={form.name}
                        required
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        className="form-input"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        required
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        className="form-input"
                        name="password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn--primary btn--full">
                    Create Account →
                </button>
            </form>
        </div>
    );
};

export default SignupForm;