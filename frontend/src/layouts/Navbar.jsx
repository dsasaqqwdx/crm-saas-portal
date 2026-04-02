
// import React from "react";
// import { NavLink, Link } from "react-router-dom";
// import { Globe } from "lucide-react";
// import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
// import fallbackLogo from "../assets/logo.png";

// const Navbar = () => {
//   const { data: s } = useWebsiteSettings("header");
//   const { data: f } = useWebsiteSettings("footer");

//   const appName = s?.appName || "Shnoor International LLC";
//   const logoSrc = f?.logo || fallbackLogo;

//   const menuItems = [
//     { name: "Home", path: "/" },
//     { name: "Features", path: "/features" },
//     { name: "Pricing", path: "/pricing" },
//     { name: "Contact", path: "/contact" }
//   ];

//   return (
//     <nav
//       className="navbar navbar-expand-lg fixed-top"
//       style={{
//         backgroundColor: "#0F172A",
//         borderBottom: "1px solid #1E293B"
//       }}
//     >
//       <div className="container">
//         <div className="d-flex align-items-center justify-content-between w-100">
//           <Link
//             className="navbar-brand d-flex align-items-center mb-0"
//             to="/"
//             style={{ color: "#E2E8F0" }}
//           >
//             <div
//               className="logo-box"
//               style={{
//                 width: 80,
//                 height: 80,
//                 overflow: "hidden",
//                 border: "1px solid #6366F1",
//                 boxShadow: "0 0 5px rgba(99,102,241,0.4)"
//               }}
//             >
//               <img
//                 src={logoSrc}
//                 alt={appName}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                 }}
//               />
//             </div>
//             <span
//               className="fw-bold text-uppercase ms-2"
//               style={{
//                 fontFamily: "'Ubuntu', sans-serif",
//                 letterSpacing: "1px",
//                 color: "#E2E8F0",
//                 fontSize: "16px"
//               }}
//             >
//               {appName}
//             </span>
//           </Link>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             style={{
//               borderColor: "#334155",
//               backgroundColor: "#1E293B"
//             }}
//           >
//             <span
//               className="navbar-toggler-icon"
//               style={{ filter: "invert(1)" }}
//             ></span>
//           </button>
//         </div>
//         <div
//           className="collapse navbar-collapse mt-3 mt-lg-0"
//           id="navbarNav"
//         >
//           <ul className="navbar-nav mx-lg-auto text-center text-lg-start">
//             {menuItems.map((item) => (
//               <li className="nav-item mx-lg-2 my-2 my-lg-0" key={item.name}>
//                 <NavLink
//                   to={item.path}
//                   className="nav-link"
//                   style={({ isActive }) => ({
//                     color: isActive ? "#6366F1" : "#E2E8F0",
//                     fontWeight: 500,
//                     borderBottom: isActive
//                       ? "2px solid #6366F1"
//                       : "2px solid transparent",
//                     transition: "0.2s"
//                   })}
//                 >
//                   {item.name}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//           <div className="d-flex flex-column flex-lg-row align-items-center gap-2 mt-3 mt-lg-0">
//             <button
//               className="btn d-flex align-items-center justify-content-center"
//               style={{
//                 border: "1px solid #1E293B",
//                 color: "#E2E8F0",
//                 backgroundColor: "#1E293B",
//                 width: "100%"
//               }}
//             >
//               <Globe size={16} className="me-1" /> EN
//             </button>

//             <Link
//               to="/register"
//               className="btn"
//               style={{
//                 border: "1px solid #6366F1",
//                 color: "#6366F1",
//                 width: "100%"
//               }}
//             >
//               Register
//             </Link>

//             <Link
//               to="/login"
//               className="btn"
//               style={{
//                 backgroundColor: "#6366F1",
//                 color: "#fff",
//                 border: "none",
//                 width: "100%"
//               }}
//             >
//               Login
//             </Link>
//           </div>
//         </div>
//       </div>

//       <style>
//         {`
//         @media (max-width: 768px) {
//           .logo-box {
//             width: 45px !important;
//             height: 45px !important;
//           }
//           .navbar-brand span {
//             font-size: 14px !important;
//           }
//         }

//         @media(max-width: 480px){
//           .logo-box {
//             width: 40px !important;
//             height: 40px !important;
//           }
//           .navbar-brand span {
//             font-size: 11px !important;
//           }
//         }
//         `}
//       </style>
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import fallbackLogo from "../assets/logo.png";

const Navbar = () => {
  const { data: s } = useWebsiteSettings("header");
  const { data: f } = useWebsiteSettings("footer");

  const appName = s?.appName || "Shnoor International LLC";
  const logoSrc = f?.logo || fallbackLogo;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid #1E293B"
      }}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between w-100">
          <Link
            className="navbar-brand d-flex align-items-center mb-0"
            to="/"
            style={{ color: "var(--text)" }}
          >
            <div
              className="logo-box"
              style={{
                width: 80,
                height: 80,
                overflow: "hidden",
                border: "1px solid var(--primary)",
                boxShadow: "0 0 5px rgba(99,102,241,0.4)"
              }}
            >
              <img
                src={logoSrc}
                alt={appName}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
            <span
              className="fw-bold text-uppercase ms-2"
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                letterSpacing: "1px",
                color: "var(--text)",
                fontSize: "16px"
              }}
            >
              {appName}
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{
              borderColor: "#334155",
              backgroundColor: "var(--surface)"
            }}
          >
            <span
              className="navbar-toggler-icon"
              style={{ filter: "invert(1)" }}
            ></span>
          </button>
        </div>
        <div
          className="collapse navbar-collapse mt-3 mt-lg-0"
          id="navbarNav"
        >
          <ul className="navbar-nav mx-lg-auto text-center text-lg-start">
            {menuItems.map((item) => (
              <li className="nav-item mx-lg-2 my-2 my-lg-0" key={item.name}>
                <NavLink
                  to={item.path}
                  className="nav-link"
                  style={({ isActive }) => ({
                    color: isActive ? "var(--primary)" : "var(--text)",
                    fontWeight: 500,
                    borderBottom: isActive
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                    transition: "0.2s"
                  })}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-column flex-lg-row align-items-center gap-2 mt-3 mt-lg-0">
            <button
              className="btn d-flex align-items-center justify-content-center"
              style={{
                border: "1px solid #1E293B",
                color: "var(--text)",
                backgroundColor: "var(--surface)",
                width: "100%"
              }}
            >
              <Globe size={16} className="me-1" /> EN
            </button>

            <Link
              to="/register"
              className="btn"
              style={{
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                width: "100%"
              }}
            >
              Register
            </Link>

            <Link
              to="/login"
              className="btn"
              style={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                border: "none",
                width: "100%"
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <style>
        {`
        @media (max-width: 768px) {
          .logo-box {
            width: 45px !important;
            height: 45px !important;
          }
          .navbar-brand span {
            font-size: 14px !important;
          }
        }

        @media(max-width: 480px){
          .logo-box {
            width: 40px !important;
            height: 40px !important;
          }
          .navbar-brand span {
            font-size: 11px !important;
          }
        }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
