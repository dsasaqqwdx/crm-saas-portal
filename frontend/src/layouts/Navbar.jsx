import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import fallbackLogo from "../assets/logo.png";

const Navbar = () => {
  const { data: s } = useWebsiteSettings("header");
const { data: f } = useWebsiteSettings("footer");
const appName = s.appName || "Shnoor";
const logoSrc = f.logo    || fallbackLogo;
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">

        <Link className="navbar-brand d-flex align-items-center" to="/">  <img src={logoSrc} alt={appName}
            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
          <span className="fw-bold text-uppercase">{appName}</span>
        </Link>
<button className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarNav">
<span className="navbar-toggler-icon"></span>
        </button> <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/features">Features</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/pricing">Pricing</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>
<div className="d-flex align-items-center">
            <button className="btn btn-outline-light me-3 d-flex align-items-center">
              <Globe size={16} className="me-1" /> EN
   </button>
            <Link to="/register" className="btn btn-outline-light me-2">Register</Link>
            <Link to="/login" className="btn btn-light">Login</Link>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;