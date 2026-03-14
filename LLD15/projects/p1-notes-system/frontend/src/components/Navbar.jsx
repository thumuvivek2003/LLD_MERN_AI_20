import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2>Notes App</h2>
    </nav>
  );
};

const styles = {
  nav: {
    background: "#282c34",
    color: "white",
    padding: "10px 20px"
  }
};

export default Navbar;