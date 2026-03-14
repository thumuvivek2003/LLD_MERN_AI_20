import React from "react";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
    return (
        <div className="auth-page">
            <div className="auth-page__brand">
                <span className="navbar__brand-dot" />
                Nota
            </div>
            <SignupForm />
            <p className="auth-page__switch">
                Already have an account? <a href="/login" className="auth-page__link">Sign in</a>
            </p>
        </div>
    );
};

export default SignupPage;