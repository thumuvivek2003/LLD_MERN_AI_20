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
        <>
            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">Login</button>
            </form>
        </>
    );
};

export default LoginForm;