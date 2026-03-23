import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import fallbackLogo from "../assets/logo.png";

const Footer = () => {
  const { data: s } = useWebsiteSettings("footer");
  const companyName = s.companyName || "Shnoor International LLC";
const tagline     = s.tagline     || "Next-gen HR management for modern businesses.";
const email       = s.email       || "support@shnoor.com";
const phone       = s.phone       || "+91 98765 43210";
const address     = s.address     || "Business Bay, Dubai / Kuppam, India";
const copyright   = s.copyright   || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
  const logoSrc     = s.logo        || fallbackLogo;
return (
    <footer className="bg-dark text-white border-top border-secondary mt-5">
      <div className="container py-5">
        <div className="row g-4">
  <div className="col-lg-4 col-md-6">
     <div className="d-flex align-items-center mb-3">
      <img src={logoSrc} alt={companyName}
      style={{ width: 42, height: 42, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
              <span className="fw-bold text-uppercase fs-5">{companyName}</span>
    </div>
            <p className="text-secondary small">{tagline}</p>
          </div>
<div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-info text-uppercase mb-3" style={{ letterSpacing: "0.08em" }}>Quick Links</h6>
 <ul className="list-unstyled d-flex flex-column gap-2">
              {[{ label: "Home", path: "/" }, { label: "Features", path: "/features" }, { label: "Pricing", path: "/pricing" }, { label: "Contact", path: "/contact" }].map(link => (
                <li key={link.path}>
       <Link to={link.path} className="text-secondary text-decoration-none small"
                    onMouseEnter={e => e.target.style.color = "#fff"}
         onMouseLeave={e => e.target.style.color = ""}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
   <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-info text-uppercase mb-3" style={{ letterSpacing: "0.08em" }}>Account</h6>
    <ul className="list-unstyled d-flex flex-column gap-2">
 {[{ label: "Login", path: "/login" }, { label: "Register", path: "/register" }].map(link => (
  <li key={link.path}>
                  <Link to={link.path} className="text-secondary text-decoration-none small"
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = ""}>{link.label}</Link>
                </li>
              ))}
            </ul>
</div>
          <div className="col-lg-4 col-md-6">   <h6 className="fw-bold text-info text-uppercase mb-3" style={{ letterSpacing: "0.08em" }}>Contact Us</h6>
 <ul className="list-unstyled d-flex flex-column gap-3">    <li className="d-flex align-items-start gap-2">
                <Mail size={15} className="text-info mt-1 flex-shrink-0" />
                <span className="text-secondary small">{email}</span>
              </li>
  <li className="d-flex align-items-start gap-2">
                <Phone size={15} className="text-info mt-1 flex-shrink-0" />
                <span className="text-secondary small">{phone}</span>
   </li>
   <li className="d-flex align-items-start gap-2">
                <MapPin size={15} className="text-info mt-1 flex-shrink-0" />
                <span className="text-secondary small">{address}</span>
    </li>
            </ul>
          </div></div>
 </div>
      <div className="border-top border-secondary py-3">
   <div className="container text-center">
   <p className="text-secondary small mb-0">{copyright}</p>
   </div>
      </div>
    </footer>
  );
};

export default Footer;