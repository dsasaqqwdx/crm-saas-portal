
// import React from "react";
// import { Link } from "react-router-dom";
// import { Mail, Phone, MapPin } from "lucide-react";
// import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
// import fallbackLogo from "../assets/logo.png";

// const Footer = () => {
//   const { data: s = {} } = useWebsiteSettings("footer");

//   const companyName = s.companyName || "Shnoor International LLC";
//   const tagline = s.tagline || "Next-gen HR management for modern businesses.";
//   const email = s.email || "support@shnoor.com";
//   const phone = s.phone || "+91 98765 43210";
//   const address = s.address || "Business Bay, Dubai / Kuppam, India";
//   const copyright =
//     s.copyright ||
//     `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
//   const logoSrc = s.logo || fallbackLogo;

//   return (
//     <footer
//       className="mt-5"
//       style={{
//         background: "#0F172A",
//         color: "#E2E8F0",
//         borderTop: "1px solid #1E293B",
//       }}
//     >
//       <div className="container py-5">
//         <div className="row g-5">
//           <div className="col-lg-4 col-md-6">
//             <div className="d-flex flex-column align-items-md-start text-md-start">
//               <div
//               className="mb-3 d-flex align-items-center justify-content-center"
//               style={{
//               width: 80,
//               height: 80,
//               overflow: "hidden",
//               border: "1px solid #6366F1",
//               boxShadow: "0 0 5px rgba(99,102,241,0.4)"
//               }}
//               >
//               <img src={logoSrc} alt={companyName} style={{width: "100%",height: "100%"}}
//               />
//               </div>

//               <h5
//                 className="fw-bold text-white"
//                 style={{
//                   fontFamily: "'Ubuntu', sans-serif",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 {companyName}
//               </h5>

//               <p
//                 className="text-secondary small mt-2"
//                 style={{ maxWidth: 320, fontFamily: "'Ubuntu', sans-serif" }}
//               >
//                 {tagline}
//               </p>
//             </div>
//           </div>
//           <div className="col-lg-2 col-md-6">
//             <h6
//               className="fw-bold text-info text-uppercase mb-3"
//               style={{ letterSpacing: "0.08em" }}
//             >
//               Quick Links
//             </h6>
//             <ul className="list-unstyled d-flex flex-column gap-2">
//               {[
//                 { label: "Home", path: "/" },
//                 { label: "Features", path: "/features" },
//                 { label: "Pricing", path: "/pricing" },
//                 { label: "Contact", path: "/contact" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-secondary text-decoration-none small footer-link"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="col-lg-2 col-md-6">
//             <h6
//               className="fw-bold text-info text-uppercase mb-3"
//               style={{ letterSpacing: "0.08em" }}
//             >
//               Account
//             </h6>
//             <ul className="list-unstyled d-flex flex-column gap-2">
//               {[
//                 { label: "Login", path: "/login" },
//                 { label: "Register", path: "/register" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-secondary text-decoration-none small footer-link"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="col-lg-4 col-md-6">
//             <h6
//               className="fw-bold text-info text-uppercase mb-3"
//               style={{ letterSpacing: "0.08em" }}
//             >
//               Contact Us
//             </h6>
//             <ul className="list-unstyled d-flex flex-column gap-3">
//               <li className="d-flex align-items-start gap-2">
//                 <Mail size={16} className="text-info mt-1 flex-shrink-0" />
//                 <span className="text-secondary small">{email}</span>
//               </li>

//               <li className="d-flex align-items-start gap-2">
//                 <Phone size={16} className="text-info mt-1 flex-shrink-0" />
//                 <span className="text-secondary small">{phone}</span>
//               </li>

//               <li className="d-flex align-items-start gap-2">
//                 <MapPin size={16} className="text-info mt-1 flex-shrink-0" />
//                 <span className="text-secondary small">{address}</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div
//         className="py-3"
//         style={{
//           borderTop: "1px solid #1E293B",
//           background: "#020617",
//         }}
//       >
//         <div className="container text-center">
//           <p className="text-secondary small mb-0">{copyright}</p>
//         </div>
//       </div>

//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import fallbackLogo from "../assets/logo.png";

const Footer = () => {
  const { data: s = {} } = useWebsiteSettings("footer");

  const companyName = s.companyName || "Shnoor International LLC";
  const tagline =
    s.tagline || "Next-gen HR management for modern businesses.";
  const email = s.email || "support@shnoor.com";
  const phone = s.phone || "+91 98765 43210";
  const address =
    s.address || "Business Bay, Dubai / Kuppam, India";

  // ✅ FIXED HERE
  const copyright =
    s.copyright ||
    `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;

  const logoSrc = s.logo || fallbackLogo;

  return (
    <footer
      className="mt-5"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        borderTop: "1px solid var(--surface)",
      }}
    >
      <div className="container py-5">
        <div className="row g-5">
          
          {/* COMPANY */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex flex-column align-items-md-start text-md-start">
              <div
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 80,
                  height: 80,
                  overflow: "hidden",
                  border: "1px solid var(--primary)",
                  boxShadow: "0 0 5px rgba(99,102,241,0.4)",
                }}
              >
                <img
                  src={logoSrc}
                  alt={companyName}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <h5
                className="fw-bold text-white"
                style={{
                  fontFamily: "'Ubuntu', sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                {companyName}
              </h5>

              <p
                className="text-secondary small mt-2"
                style={{ maxWidth: 320 }}
              >
                {tagline}
              </p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase mb-3">
              Quick Links
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "Features", path: "/features" },
                { label: "Pricing", path: "/pricing" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-secondary text-decoration-none small footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ACCOUNT */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase mb-3">
              Account
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { label: "Login", path: "/login" },
                { label: "Register", path: "/register" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-secondary text-decoration-none small footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-uppercase mb-3">
              Contact Us
            </h6>

            <ul className="list-unstyled d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2">
                <Mail size={16} className="text-info mt-1" />
                <span className="text-secondary small">{email}</span>
              </li>

              <li className="d-flex align-items-start gap-2">
                <Phone size={16} className="text-info mt-1" />
                <span className="text-secondary small">{phone}</span>
              </li>

              <li className="d-flex align-items-start gap-2">
                <MapPin size={16} className="text-info mt-1" />
                <span className="text-secondary small">{address}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        className="py-3"
        style={{
          borderTop: "1px solid var(--surface)",
        }}
      >
        <div className="container text-center">
          <p className="text-secondary small mb-0">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;