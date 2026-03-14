import React from "react";
import { useState } from "react";
import { login } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        email: "vivek@gmail.com",
        password: "12345"
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError(""); // clear previous error

            const data = await login(form);
            const user = data.data.user;
            const token = data.data.token;

            loginUser(user, token);

            // redirect based on role
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="auth-form">
            <div className="auth-form__header">
                <p className="auth-form__eyebrow">Welcome back</p>
                <h2 className="auth-form__title">Sign in to Nota</h2>
            </div>

            {error && (
                <div className="form-error">
                    <span className="form-error__icon">⚠</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label className="form-label" htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        className="form-input"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form?.email ?? ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        className="form-input"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={form?.password ?? ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn--primary btn--full">
                    Sign In →
                </button>
            </form>
        </div>
    );
};

export default LoginForm;