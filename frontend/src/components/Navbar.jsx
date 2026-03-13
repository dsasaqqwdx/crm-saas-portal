import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-2" style={{width:"40px",height:"40px"}}>
            <strong>S</strong>
          </div>
          <span className="fw-bold text-uppercase">Shnoor</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav mx-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/features">Features</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/pricing">Pricing</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>

          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center">

            <button className="btn btn-outline-light me-3 d-flex align-items-center">
              <Globe size={16} className="me-1"/>
              EN
            </button>

            <Link to="/register" className="btn btn-outline-light me-2">
              Register
            </Link>

            <Link to="/login" className="btn btn-light">
              Login
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;