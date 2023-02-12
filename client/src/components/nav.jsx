import React from "react";
import { Link } from "react-router-dom";
import "./nav.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/home" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/course/running" className="nav-link">Running</Link>
        </li>
        <li className="nav-item">
          <Link to="/home/registration" className="nav-link">Registration</Link>
        </li>
        <li className="nav-item">
          
          <Link to="/logout" className="nav-link">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
