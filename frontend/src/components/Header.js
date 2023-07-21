import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser, registerUser } = useContext(AuthContext);
  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      {user ? (
        <Link onClick={logoutUser}>Logout</Link>
      ) : (
        <span>
          <Link to="/register">Register</Link>
          <span> | </span>
          <Link to="/login">Login</Link>
        </span>
      )}
      <span> | </span>
      {user && <span>ELO, {user.username}!</span>}
    </div>
  );
};

export default Header;
