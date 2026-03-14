import React from "react";
import LoginForm from "../components/LoginForm";

export const LoginPage = () => {
    return (
        <div className="auth-page">
            <div className="auth-page__brand">
                <span className="navbar__brand-dot" />
                Nota
            </div>
            <LoginForm />
            <p className="auth-page__switch">
                Don't have an account? <a href="/signup" className="auth-page__link">Sign up</a>
            </p>
        </div>
    );
};

export default LoginPage;