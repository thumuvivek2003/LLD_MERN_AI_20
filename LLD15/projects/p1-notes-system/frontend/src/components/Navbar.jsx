import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__brand-dot" />
        Nota
      </Link>
      <span className="navbar__meta">Your private journal</span>
    </nav>
  );
};

export default Navbar;