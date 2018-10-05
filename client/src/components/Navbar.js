import React from "react";
import { Link } from "react-router-dom";

const Navbar = props => {
  const { authenticated, logout } = props;
  return (
    <div className="navbar">
      <Link to="/states">States Game</Link>
      <Link to="/cities">Cities Game</Link>
      {authenticated && (
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
