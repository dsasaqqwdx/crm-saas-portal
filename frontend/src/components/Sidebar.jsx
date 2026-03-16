
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Clock,
  Package,
  Palmtree,
  CalendarRange,
  Wallet,
  Settings,
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Add Employee", path: "/add-employee", icon: <UserPlus size={18} /> },
    { name: "Attendance", path: "/attendance", icon: <Clock size={18} /> },
    { name: "Assets", path: "/assets", icon: <Package size={18} /> },
    { name: "Holidays", path: "/holidays", icon: <Palmtree size={18} /> },
    { name: "Leaves", path: "/leaves", icon: <CalendarRange size={18} /> },
    { name: "Payroll", path: "/payroll", icon: <Wallet size={18} /> }
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
      style={{ width: "250px", height: "100vh", position: "fixed" }}
    >

      {/* LOGO */}
      <div className="d-flex align-items-center mb-4 border-bottom pb-3">
        <div
          className="bg-primary text-white d-flex align-items-center justify-content-center rounded"
          style={{ width: "35px", height: "35px" }}
        >
          S
        </div>

        <span className="ms-2 fs-5 fw-bold">
          Shnoor
        </span>
      </div>


      
      <ul className="nav nav-pills flex-column mb-auto">

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path} className="nav-item mb-1">

              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center ${
                  isActive ? "active bg-primary text-white" : "text-white"
                }`}
              >

                <span className="me-2">{item.icon}</span>

                {item.name}

              </Link>

            </li>
          );
        })}
      </ul>


      
      <hr />

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <Link to="/settings" className="nav-link text-white d-flex align-items-center">
            <Settings size={18} className="me-2" />
            Settings
          </Link>
        </li>

        <li className="nav-item">
          <button
            className="btn btn-outline-danger w-100 d-flex align-items-center"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <LogOut size={18} className="me-2" />
            Logout
          </button>
        </li>

      </ul>

    </div>
  );
};

export default Sidebar;